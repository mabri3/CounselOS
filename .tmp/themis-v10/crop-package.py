from pathlib import Path
import zipfile,xml.etree.ElementTree as E
src=Path('.tmp/themis-v10/candidate.pptx');dst=Path('.tmp/themis-v10/candidate-cropped.pptx')
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED) as zout:
 for item in zin.infolist():
  b=zin.read(item.filename)
  if item.filename=='ppt/slides/slide5.xml':
   root=E.fromstring(b);pic=root.find('.//p:pic',ns);fill=pic.find('p:blipFill',ns)
   old=fill.find('a:srcRect',ns)
   if old is not None:fill.remove(old)
   rect=E.Element('{'+ns['a']+'}srcRect',{'l':'19000','t':'16600','r':'16000','b':'57000'})
   fill.insert(1,rect)
   xf=pic.find('p:spPr/a:xfrm',ns)
   xf.find('a:off',ns).attrib.update(x=str(64*9525),y=str(255*9525))
   xf.find('a:ext',ns).attrib.update(cx=str(862*9525),cy=str(365*9525))
   b=E.tostring(root,encoding='utf-8',xml_declaration=True)
  zout.writestr(item,b)
print(dst)
