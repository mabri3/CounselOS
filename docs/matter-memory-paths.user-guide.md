# Use memory and solution paths in experimental chat

Open `http://localhost:3000/experimental/chat` while the normal development app is running. Select a matter. Choose a configured model with the model picker beside Send. No special slash command is required. The shared Matter paths skill applies to new matter-chat runs unless disabled.

## Start with the current matter

Ask: “Summarize the actual facts, our current approach, open questions, and the next useful step.”

Actual facts are reported events or conditions. The current direction is the approach you want to develop. A conversation can explore another path without changing that direction. A saved working note helps the assistant continue; it does not replace facts, recommendations, or decisions.

## Explore and compare

Send one message at a time. These are examples, not required command words.

1. “Explore an alternative where a bank holds the funds. Keep this hypothetical. We do not yet have a bank agreement.”
2. “From that bank option, explore a version without instant withdrawals. Keep the other assumptions.”
3. “Compare the original approach and both bank options. Show benefits, drawbacks, pending conditions, and evidence that could change the answer.”

Open **Approaches** above chat. Each row shows an approach and whether it is current or an alternative. Select two or more rows, click **Compare these approaches**. The comparison starts immediately and returns to chat. A concrete exploration request saves an alternative without separate save wording. The list refreshes after the answer.

Approach names stay fixed when their status changes. The initial fallback name is **Original plan**. To change a name, open **Details → Rename approach**, edit the name, and select **Save name**. Renaming does not select a direction or change assumptions.

Click **Details** to read an approach's summary, assumptions and open questions. **Discuss this approach** changes the focus of this conversation without making the approach current.

## Choose or restore a direction

Say: “Use the bank option with instant withdrawals as our current direction. The bank agreement remains pending.”

Alternatively, open **Approaches → Details** on the alternative and use **Make this our current approach** near the top. This is the former **Use as direction** control. The former direction remains an alternative. Selection does not establish that the bank agreement exists, complete work, or record a formal decision.

To go back, open **Details** on the earlier approach and select **Make this our current approach**. Current factual corrections remain in force. Restoration does not roll the matter back to old facts.

For a factual correction, state it separately: “Correction to the actual facts: we currently hold funds for two days. No bank arrangement has been implemented.”

## Continue later

After useful work, ask: “Save where we are, the unresolved conditions, and the next step.” Open **Details → More options → View saved working note** to read the saved task, next step and open work.

Reload the page or return through **History**. Ask: “Where did we leave off? Which approach are we developing, and what remains unresolved?”

Saved conversations retain their own working path. A different conversation can work on another alternative in the same matter.

## Use documents

Attach documents to the matter. Ask a focused question, for example: “Read the termination provisions, exceptions, and referenced schedules. Compare their effect on our two approaches. Give the source and page for each material point.”

The source library stores extracted pages and a search index. The assistant can retrieve relevant passages without inserting every document into each model request. Under **Details → More options**, **Read saved evidence** lets you inspect saved versions and passages. An uploaded file is not proof that every page was read. Scanned pages require successful text extraction; inspect the retained page image when needed.

## Adjust behavior

Open **Skills** in experimental chat to edit the shared Matter paths instructions. Changes apply to later runs. A run already submitted keeps its captured instructions. You do not need to edit this skill to use the feature.

## What to check

- Alternatives must not silently become actual facts.
- A selected direction must leave the prior approach available.
- Reload must preserve direction, conversation focus, and saved notes.
- Source links must support the answer and point to the correct version.
- Useful answers must remain visible if a note or source read fails.

Storage and scripted behavior have automated and browser checks. Real-model interpretation of varied lawyer language remains to be assessed through normal use. For a defect, save the exact message, expected behavior, and observed result.
