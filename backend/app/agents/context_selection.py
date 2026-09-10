"""Deterministic whole-record selection. Lexical relevance is not legal judgment."""
import json
import re


def ranked(records, query):
    terms=set(re.findall(r'[\w-]{3,}',query.casefold()))
    def score(item):
        text=json.dumps(item,ensure_ascii=False).casefold()
        explicit=any(str(value).casefold() in query.casefold() for key,value in item.items() if key.endswith('_id') and value)
        return (-int(explicit),-int(bool(item.get('supersedes'))),-sum(t in text for t in terms),str(item.get('updated_at') or item.get('created_at') or ''))
    return sorted(records,key=score)


def pack(text, limit, query=''):
    """Never cut structured JSON; compact lists by complete record."""
    if len(text)<=limit: return text,[]
    try: data=json.loads(text)
    except (ValueError,TypeError):
        # Unstructured sources are explicitly excerpted at paragraph boundaries.
        pieces=[];used=0
        for paragraph in text.split('\n\n'):
            if used+len(paragraph)+2>limit: break
            pieces.append(paragraph);used+=len(paragraph)+2
        return ('\n\n'.join(pieces) if pieces else text[:limit]),['remaining text available through bounded read']
    if isinstance(data,list):
        items=ranked(data,query) if all(isinstance(i,dict) for i in data) else data
        kept=[];omitted=[]
        for item in items:
            proposed=json.dumps([*kept,item],ensure_ascii=False)
            if len(proposed)<=limit: kept.append(item)
            else:
                omitted.append(next((str(v) for k,v in item.items() if k.endswith('_id')), 'record') if isinstance(item,dict) else 'record')
        return json.dumps(kept,ensure_ascii=False) if limit>=2 else '',omitted
    return '',['structured record exceeds available budget; read by ID']


def recent_messages(history, *, max_messages=12, max_chars=24000):
    result=[];used=0
    for item in reversed(history[-max_messages:]):
        text=item.content if hasattr(item,'content') else item.get('content','')
        if used+len(text)>max_chars: continue
        result.append(item);used+=len(text)
    return list(reversed(result))
