import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/bharris/Programs/counsel-os-mvp";
const TMP = `${ROOT}/.tmp/themis-bright-deck`;
const OUT = `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Investor-Deck-Editorial.pptx`;
const ASSET = `${ROOT}/output/deck/assets/bright-editorial`;
const COVER = `${ASSET}/cover-flashlight-bw.png`;
const JOURNEY = `${ASSET}/journey-selective-color-two-beams.png`;
const SCREENSHOT = `${ROOT}/output/deck/screenshots/matter.png`;
const LOGO = `${ROOT}/frontend/public/brand/themis-ai-logo-vibrant-red-v6.png`;

const W = 1280;
const H = 720;
const C = {
  navy: "#16233F",
  navy2: "#223154",
  cobalt: "#3E5F9D",
  coral: "#C86449",
  yellow: "#C79A2B",
  aqua: "#2E8984",
  white: "#FCFAF4",
  ink: "#16233F",
  paleBlue: "#EDF1F6",
  paleAqua: "#E8F1EF",
  paleCoral: "#F3E5DF",
  paleYellow: "#F2E8C8",
  gray: "#606878",
  line: "#D5D9DF",
};
const SERIF = "Georgia";
const SANS = "Arial";

const IMAGE_PATHS = [
  COVER,
  `${ASSET}/blind-spots.png`,
  JOURNEY,
  `${ASSET}/defensible-leap.png`,
  SCREENSHOT,
  LOGO,
];
const IMAGE_BYTES = new Map(
  await Promise.all(IMAGE_PATHS.map(async (path) => [path, new Uint8Array(await fs.readFile(path))])),
);

async function writeBlob(path, blob) {
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

function rect(slide, name, x, y, w, h, fill, radius = false, lineFill = "none", lineWidth = 0) {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
  });
}

function rule(slide, x, y, w, fill = C.ink, height = 2) {
  return rect(slide, `rule-${x}-${y}`, x, y, w, height, fill);
}

function text(slide, name, value, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill ?? "none",
    line: { style: "solid", fill: opts.lineFill ?? "none", width: opts.lineWidth ?? 0 },
  });
  shape.text = value;
  shape.text.style = {
    fontSize: opts.fontSize ?? 18,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    typeface: opts.typeface ?? SANS,
    alignment: opts.alignment ?? "left",
    verticalAlignment: opts.verticalAlignment ?? "top",
    lineSpacing: opts.lineSpacing ?? 1.08,
    insets: opts.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
    autoFit: opts.autoFit ?? "none",
    wrap: "square",
  };
  return shape;
}

function rich(slide, name, paragraphs, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill ?? "none",
    line: { style: "solid", fill: opts.lineFill ?? "none", width: opts.lineWidth ?? 0 },
  });
  shape.text.set(paragraphs);
  shape.text.style = {
    fontSize: opts.fontSize ?? 18,
    color: opts.color ?? C.ink,
    typeface: opts.typeface ?? SANS,
    alignment: opts.alignment ?? "left",
    verticalAlignment: opts.verticalAlignment ?? "top",
    lineSpacing: opts.lineSpacing ?? 1.08,
    insets: opts.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
    autoFit: opts.autoFit ?? "none",
    wrap: "square",
  };
  return shape;
}

function image(slide, name, path, x, y, w, h, fit = "cover", alt = "") {
  const blob = IMAGE_BYTES.get(path);
  if (!blob) throw new Error(`Image was not preloaded: ${path}`);
  return slide.images.add({
    blob,
    contentType: "image/png",
    alt,
    fit,
    position: { left: x, top: y, width: w, height: h },
  });
}

function footer(slide, n, dark = false) {
  const color = dark ? C.white : C.navy;
  text(slide, `footer-brand-${n}`, "THEMIS.AI", 44, 690, 140, 16, { fontSize: 10, bold: true, color, lineSpacing: 1 });
  text(slide, `footer-number-${n}`, String(n).padStart(2, "0"), 1194, 688, 40, 18, { fontSize: 11, bold: true, color, alignment: "right", lineSpacing: 1 });
}

function kicker(slide, name, value, x, y, w, color = C.coral) {
  return text(slide, name, value.toUpperCase(), x, y, w, 22, { fontSize: 12, bold: true, color, lineSpacing: 1 });
}

function notes(slide, lines) {
  slide.speakerNotes.textFrame.setText(["[Sources]", ...lines]);
}

function title(slide, n, value, opts = {}) {
  kicker(slide, `kicker-${n}`, opts.kicker ?? `THEMIS THESIS  /  ${String(n).padStart(2, "0")}`, opts.x ?? 54, opts.kickerY ?? 36, opts.w ?? 1172, opts.kickerColor ?? C.coral);
  return text(slide, `title-${n}`, value, opts.x ?? 54, opts.y ?? 64, opts.w ?? 1172, opts.h ?? 96, {
    fontSize: opts.fontSize ?? 41,
    bold: true,
    color: opts.color ?? C.navy,
    typeface: SERIF,
    lineSpacing: opts.lineSpacing ?? 0.98,
  });
}

function numberedItem(slide, name, n, head, body, x, y, w, opts = {}) {
  text(slide, `${name}-num`, String(n).padStart(2, "0"), x, y, 34, 26, { fontSize: 13, bold: true, color: opts.numColor ?? C.coral, lineSpacing: 1 });
  text(slide, `${name}-head`, head, x + 40, y - 1, w - 40, 28, { fontSize: opts.headSize ?? 17, bold: true, color: opts.headColor ?? C.navy, lineSpacing: 1.02 });
  text(slide, `${name}-body`, body, x + 40, y + 28, w - 40, opts.bodyH ?? 58, { fontSize: opts.bodySize ?? 14.5, color: opts.bodyColor ?? C.navy, lineSpacing: 1.13 });
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

// Slide 1 — The emotional promise
{
  const slide = deck.slides.add();
  image(slide, "cover-art", COVER, 0, 0, W, H, "cover", "A lawyer directing a beam across uncertain terrain in black and white");
  rect(slide, "cover-scrim", 0, 0, 760, H, "linear(0deg, #11141BF5 0%, #11141BE8 68%, #11141B00 100%)");
  rect(slide, "logo-ground", 48, 38, 190, 58, C.white, true);
  image(slide, "logo", LOGO, 62, 48, 162, 38, "contain", "Themis.ai logo");
  text(slide, "cover-title", "The lawyer makes the call.\nThemis makes sure they do not face it alone.", 54, 136, 720, 208, {
    fontSize: 48, bold: true, color: C.white, typeface: SERIF, lineSpacing: 0.98,
  });
  text(slide, "cover-support", "Themis is a companion to legal judgment—\na flashlight in the dark.", 56, 363, 560, 70, {
    fontSize: 25, bold: true, color: C.yellow, typeface: SERIF, lineSpacing: 1.02,
  });
  text(slide, "cover-context", "Legal judgment is rarely a search for one obvious answer. The lawyer must understand an uncertain legal space, see what could change the analysis, and make a decision the business can act on. Themis helps illuminate that space while leaving the judgment with the lawyer.", 56, 450, 600, 108, {
    fontSize: 17, color: C.white, lineSpacing: 1.15,
  });
  rect(slide, "cover-bottom", 0, 596, 760, 124, C.coral);
  text(slide, "cover-bottom-line", "Themis supports the person responsible for the answer. It does not replace their judgment.", 56, 620, 650, 68, {
    fontSize: 22, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 1.05,
  });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${COVER} — black-and-white edit of the original generated illustration for this deck`,
  ]);
}

// Slide 2 — The private burden
{
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  image(slide, "blind-spots-art", `${ASSET}/blind-spots.png`, 720, 0, 560, H, "cover", "A professional studying branching paths and hidden terrain");
  rect(slide, "image-edge", 698, 0, 22, H, C.yellow);
  title(slide, 2, "The lawyer must make the call before the whole terrain is visible.", { w: 650, h: 108, fontSize: 35 });
  text(slide, "s2-context", "The business wants an answer. The facts are incomplete. The law leaves room for judgment. The lawyer must choose a path without knowing whether an unseen fact, issue, or consequence could change it.", 54, 176, 592, 102, { fontSize: 18, lineSpacing: 1.15 });
  text(slide, "s2-q1", "For the lawyer, the question is not simply:", 54, 292, 592, 28, { fontSize: 16, color: C.gray });
  text(slide, "s2-answer", "What is the answer?", 54, 326, 592, 36, { fontSize: 25, color: C.gray, typeface: SERIF, italic: true });
  text(slide, "s2-it-is", "It is:", 54, 370, 120, 24, { fontSize: 16, color: C.gray });
  rect(slide, "s2-quote-bar", 54, 405, 10, 96, C.coral);
  text(slide, "s2-quote", "What am I missing that could change my answer?", 82, 402, 570, 105, { fontSize: 31, bold: true, color: C.cobalt, typeface: SERIF, lineSpacing: 1.02 });
  text(slide, "s2-closing", "The emotional burden is not simple darkness or a lack of information. It is the responsibility of making a consequential decision while knowing that something important may remain outside the beam.", 54, 524, 600, 88, { fontSize: 16.5, bold: true, lineSpacing: 1.13 });
  text(slide, "s2-implication", "Faster research and drafting can reduce effort. They do not remove the lawyer's responsibility for deciding whether the analysis is complete enough to act. That is the burden Themis is designed to support.", 54, 622, 600, 66, { fontSize: 14.5, color: C.gray, lineSpacing: 1.13 });
  rect(slide, "s2-source-ground", 740, 538, 510, 146, "#16233FE8", true);
  rich(slide, "s2-source", [[{ run: "Research signal: ", textStyle: { bold: true, color: C.yellow } }, { run: "In four discovery interviews, in-house lawyers described feeling “on an island,” wanting another lawyer nearby, seeking a gut check, and wanting help finding blind spots. These are themes from auto-generated interview notes, not verified quotations.", textStyle: { color: C.white } }]], 764, 562, 462, 102, { fontSize: 14.5, color: C.white, lineSpacing: 1.14 });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${ASSET}/blind-spots.png — original generated illustration for this deck`,
    `${ROOT}/output/research/raw/interviews/in-house-counsel/`,
  ]);
}

// Slide 3 — The thesis
{
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  rect(slide, "s3-top-accent", 0, 0, 18, 520, C.coral);
  title(slide, 3, "Themis makes uncertainty visible enough for the lawyer to exercise judgment.", { fontSize: 39, kickerColor: C.cobalt });
  rule(slide, 54, 150, 1172, C.navy, 3);
  text(slide, "s3-context1", "Themis is the flashlight in the darkness of uncertainty. It illuminates the legal terrain—the law, facts, assumptions, and unknowns—so the lawyer can chart their own path forward.", 54, 178, 400, 130, { fontSize: 19, bold: true, typeface: SERIF, lineSpacing: 1.13 });
  text(slide, "s3-context2", "Themis helps lawyers see the question clearly, test their thinking, and move forward with confidence.", 54, 326, 400, 82, { fontSize: 18, lineSpacing: 1.15 });
  rect(slide, "s3-closing-ground", 54, 416, 400, 84, C.coral, true);
  text(slide, "s3-closing", "The answer remains the lawyer's. Themis strengthens the path to it.", 74, 432, 360, 58, { fontSize: 20, bold: true, typeface: SERIF, lineSpacing: 1.05 });
  text(slide, "s3-help", "It helps the lawyer:", 500, 176, 680, 30, { fontSize: 17, bold: true, color: C.cobalt });
  const bullets = [
    "dissect the question to reveal what is known, assumed, and still unknown;",
    "illuminate the issues, facts, laws, assumptions, and unknowns that shape the decision;",
    "test the path they are taking;",
    "uncover blind spots that could change the answer; and",
    "preserve the context and reasoning that support the final call.",
  ];
  bullets.forEach((b, i) => {
    text(slide, `s3-num-${i}`, String(i + 1).padStart(2, "0"), 500, 221 + i * 54, 34, 24, { fontSize: 12, bold: true, color: C.coral, lineSpacing: 1 });
    text(slide, `s3-bullet-${i}`, b, 542, 216 + i * 54, 650, 46, { fontSize: 16.5, color: C.navy, lineSpacing: 1.08 });
    rule(slide, 500, 260 + i * 54, 692, "#16233F33", 1);
  });
  rect(slide, "s3-bottom", 0, 520, W, 200, C.navy);
  kicker(slide, "s3-confidence-kicker", "What “confidence” means", 54, 548, 400, C.aqua);
  text(slide, "s3-confidence", "Confidence is not certainty. It comes from seeing the terrain more clearly: the questions, risks, assumptions, sources, alternatives, and remaining unknowns. The lawyer can then explain why they chose the path they did.", 54, 578, 550, 100, { fontSize: 16.5, color: C.white, lineSpacing: 1.14 });
  kicker(slide, "s3-implication-kicker", "Implication", 670, 548, 200, C.coral);
  text(slide, "s3-implication", "The product's job is not to perform legal authority. It is to improve the conditions under which the lawyer exercises it.", 670, 578, 520, 86, { fontSize: 19, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.12 });
  notes(slide, [`${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`]);
}

// Slide 4 — What lawyers are asking for
{
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  title(slide, 4, "Lawyers are not only asking for faster work. They want a second perspective as they work through the decision.", { fontSize: 36, kickerColor: C.coral, color: C.navy, h: 100 });
  rect(slide, "s4-context-ground", 54, 166, 1172, 88, C.white, true);
  text(slide, "s4-context", "Across four interviews with in-house lawyers and 203 de-duplicated Reddit discussions about legal AI, the requested tasks and features varied. The recurring need was more consistent: a capable second perspective that helps the lawyer examine the question, test their reasoning, and decide with confidence.", 78, 182, 1124, 64, { fontSize: 16.5, lineSpacing: 1.12 });
  const voices = [
    ["“I need someone to think with.”", "A second legal perspective helps the lawyer work through ambiguity instead of facing a blank page or a finished answer."],
    ["“I need to know what I may have missed.”", "The lawyer wants thoughtful challenge: another issue, another fact, another interpretation, or another consequence that could change the path."],
    ["“I need support that respects my judgment.”", "The system can inform, question, and test. The lawyer must remain the author of the decision."],
    ["“I need my reasoning tested before I rely on it.”", "Confidence becomes fragile when material counterexamples, conflicting facts, or overlooked problems remain outside the lawyer's view. Themis should surface them before the decision is made."],
  ];
  voices.forEach((v, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 54 + col * 600;
    const y = 286 + row * 138;
    rule(slide, x, y, 536, col ? C.yellow : C.navy, 5);
    text(slide, `s4-quote-${i}`, v[0], x, y + 16, 536, 38, { fontSize: 22, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 1.03 });
    text(slide, `s4-voice-${i}`, v[1], x, y + 58, 536, 65, { fontSize: 15.5, color: C.navy, lineSpacing: 1.13 });
  });
  rect(slide, "s4-bottom", 0, 574, W, 146, C.navy);
  text(slide, "s4-implication", "The adoption opportunity may not be another feature bundle. It may be a product relationship in which the lawyer receives useful challenge without giving up control.", 54, 596, 486, 92, { fontSize: 17, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.12 });
  rich(slide, "s4-source", [[{ run: "Source: ", textStyle: { bold: true, color: C.yellow } }, { run: "Themis analysis of 203 de-duplicated Reddit discussions about legal AI and four discovery interviews with in-house lawyers, August 2026. The statements above synthesize recurring themes; they are not direct quotations. Interview quotations should not appear externally without approval and verification against the recordings.", textStyle: { color: C.white } }]], 602, 596, 624, 94, { fontSize: 13.5, color: C.white, lineSpacing: 1.12 });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${ROOT}/output/research/raw/legal-ai-reddit-source-corpus.jsonl`,
    `${ROOT}/output/research/raw/interviews/in-house-counsel/`,
  ]);
}

// Slide 5 — Why much of legal AI feels incomplete
{
  const slide = deck.slides.add();
  slide.background.fill = C.navy;
  title(slide, 5, "Most legal AI competes to produce the work. The harder problem is helping the lawyer own the judgment.", { fontSize: 38, color: C.white, kickerColor: C.aqua, h: 100 });
  text(slide, "s5-context", "The market is improving quickly at search, summarization, drafting, and task automation. Those capabilities are useful, but they do not resolve the lawyer's deeper burden.", 54, 178, 510, 92, { fontSize: 18, color: C.white, lineSpacing: 1.15 });
  text(slide, "s5-lead", "A generated answer can still leave the lawyer asking:", 650, 174, 530, 34, { fontSize: 17, bold: true, color: C.yellow });
  const qs = [
    "What assumptions did it make?",
    "What did it fail to consider?",
    "How does this fit the facts and history of this matter?",
    "Can I explain and defend this decision later?",
  ];
  qs.forEach((q, i) => {
    text(slide, `s5-qnum-${i}`, String(i + 1), 650, 228 + i * 54, 28, 30, { fontSize: 13, bold: true, color: C.coral, lineSpacing: 1 });
    text(slide, `s5-q-${i}`, q, 688, 222 + i * 54, 500, 38, { fontSize: 18, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.05 });
  });
  rect(slide, "s5-contrast", 54, 294, 510, 132, C.cobalt, true);
  kicker(slide, "s5-contrast-kicker", "Contrast", 78, 316, 150, C.yellow);
  text(slide, "s5-contrast-text", "Many products ask the lawyer to evaluate and trust an output. Themis is designed to drive the process that helps the lawyer examine the question, test their reasoning, and gain confidence in their decision.", 78, 344, 462, 78, { fontSize: 16, color: C.white, lineSpacing: 1.12 });
  rect(slide, "s5-bottom", 0, 462, W, 258, C.white);
  kicker(slide, "s5-investor-kicker", "Investor implication", 54, 490, 230, C.coral);
  text(slide, "s5-investor", "The distinction is not “better intelligence.” It is a different role in the lawyer's work. A product that only produces an output competes on capability. A product that helps the lawyer reach and preserve a defensible judgment can compete on trust, context, and repeated use.", 54, 520, 510, 116, { fontSize: 16.5, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 1.12 });
  kicker(slide, "s5-thesis-kicker", "Themis thesis", 650, 490, 190, C.cobalt);
  text(slide, "s5-thesis", "This market gap is our interpretation of the interview and research corpus. It is not yet proof that buyers will select or retain Themis for this reason.", 650, 520, 530, 58, { fontSize: 16, color: C.navy, lineSpacing: 1.12 });
  rich(slide, "s5-source", [[{ run: "Source: ", textStyle: { bold: true, color: C.coral } }, { run: "Themis analysis of 203 de-duplicated Reddit discussions about legal AI, combined with four in-house counsel discovery interviews. See appendix for source files and limits.", textStyle: { color: C.gray } }]], 650, 598, 530, 56, { fontSize: 13.5, color: C.gray, lineSpacing: 1.1 });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${ROOT}/output/research/raw/legal-ai-reddit-source-corpus.jsonl`,
    `${ROOT}/output/research/raw/interviews/in-house-counsel/`,
  ]);
}

// Slide 6 — The journey
{
  const slide = deck.slides.add();
  image(slide, "journey-art", JOURNEY, 0, 0, W, H, "cover", "A lawyer using a yellow beam to reveal color within otherwise grayscale uncertain terrain");
  rect(slide, "s6-title-ground", 30, 24, 1220, 160, "#FCFAF4F2", true);
  kicker(slide, "s6-kicker", "THEMIS THESIS  /  06", 54, 42, 260, C.coral);
  text(slide, "s6-title", "Themis illuminates the terrain and stays beside the lawyer through the climb.", 54, 68, 1168, 84, { fontSize: 34, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 0.98 });
  text(slide, "s6-context", "Themis treats legal work as a continuing matter, not a series of isolated prompts. It helps the lawyer move from an incomplete request to an organized view of the decision, while keeping uncertainty and ownership visible.", 54, 150, 1168, 34, { fontSize: 13.5, color: C.navy, lineSpacing: 1.06 });
  const journey = [
    ["Enter uncertain terrain", "A request comes in with incomplete facts, hidden assumptions, and pressure to respond."],
    ["Illuminate what is known", "Themis organizes the matter so the lawyer can see the legal space, the business context, and what is at stake."],
    ["Reveal forks and hazards", "It surfaces questions, competing interpretations, missing facts, and consequences that could change the path."],
    ["Show the edge of the beam", "It distinguishes what is known, assumed, supported, unresolved, or uncertain. It does not pretend that the entire terrain is visible."],
    ["Leave the route to the lawyer", "It helps the lawyer test and form a recommendation while keeping the final judgment with the lawyer."],
    ["Remember the route taken", "It preserves the context, reasoning, sources, and recorded decision when the matter returns."],
  ];
  journey.forEach((j, i) => {
    const x = 34 + i * 206;
    const y = i % 2 === 0 ? 202 : 364;
    rect(slide, `s6-item-ground-${i}`, x, y, 190, 156, i % 2 === 0 ? "#16233FEA" : "#FCFAF4F0", true);
    text(slide, `s6-item-num-${i}`, String(i + 1).padStart(2, "0"), x + 14, y + 14, 28, 22, { fontSize: 12, bold: true, color: i % 2 === 0 ? C.yellow : C.coral, lineSpacing: 1 });
    text(slide, `s6-item-head-${i}`, j[0], x + 14, y + 40, 162, 40, { fontSize: 15, bold: true, color: i % 2 === 0 ? C.white : C.navy, typeface: SERIF, lineSpacing: 1.02 });
    text(slide, `s6-item-body-${i}`, j[1], x + 14, y + 78, 162, 68, { fontSize: 11.5, color: i % 2 === 0 ? C.white : C.navy, lineSpacing: 1.1 });
  });
  rect(slide, "s6-bottom", 0, 594, W, 126, C.navy);
  text(slide, "s6-closing", "Themis helps the lawyer see the climb. The lawyer still chooses the path and takes the final step.", 54, 616, 540, 62, { fontSize: 19, bold: true, color: C.yellow, typeface: SERIF, lineSpacing: 1.1 });
  text(slide, "s6-product", "The workflow matters because it gives the companion role a durable form. Themis does not disappear after producing an answer; it stays with the matter through questions, research, recommendations, decisions, and later review.", 662, 614, 556, 70, { fontSize: 14.5, color: C.white, lineSpacing: 1.14 });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${JOURNEY} — selective-color edit of the original generated illustration for this deck`,
  ]);
}

// Slide 7 — Product proof
{
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  rect(slide, "s7-cobalt-field", 0, 0, 26, H, C.cobalt);
  title(slide, 7, "A matter is not a chat. It is a durable record of how the lawyer reached the call.", { fontSize: 38, h: 88 });
  text(slide, "s7-context", "Legal work is not a sequence of isolated answers. It is a matter moving toward a legal and business objective.\n\nThemis organizes the work around that objective. It synthesizes the request, facts, issues, sources, open questions, recommendations, and recorded decisions so the lawyer can understand the whole matter and move it toward a sound decision.", 54, 150, 1172, 78, { fontSize: 15.5, lineSpacing: 1.1 });
  image(slide, "s7-screenshot", SCREENSHOT, 54, 236, 748, 294, "contain", "Current Themis matter page");
  rule(slide, 54, 536, 748, C.cobalt, 4);
  const proof = [
    ["It listened.", "The request, facts, and business context remain visible."],
    ["It understood what is at stake.", "The issues and implications are organized around the matter."],
    ["It illuminates.", "Questions, gaps, assumptions, and uncertainty stay in view."],
    ["It supports the judgment.", "Recommendations can develop without becoming recorded decisions."],
    ["It remembers the path.", "The sources, reasoning, open work, and decision persist over time."],
  ];
  proof.forEach((p, i) => {
    const y = 236 + i * 58;
    text(slide, `s7-proof-head-${i}`, p[0], 842, y, 366, 22, { fontSize: 14.5, bold: true, color: i % 2 ? C.coral : C.cobalt, lineSpacing: 1 });
    text(slide, `s7-proof-body-${i}`, p[1], 842, y + 22, 366, 32, { fontSize: 12.5, color: C.navy, lineSpacing: 1.08 });
  });
  rect(slide, "s7-bottom", 54, 548, 1172, 136, C.paleBlue, true);
  text(slide, "s7-support", "The model can change. The matter remembers.", 76, 568, 340, 52, { fontSize: 22, bold: true, color: C.cobalt, typeface: SERIF, lineSpacing: 1.02 });
  text(slide, "s7-implication", "Persistent context lets Themis become more useful each time the matter returns. It also lets the lawyer see the basis for prior work instead of reconstructing the reasoning from chat history.", 76, 620, 340, 58, { fontSize: 12.5, color: C.navy, lineSpacing: 1.08 });
  text(slide, "s7-grounding", "The current system uses Markdown as the durable source of truth and SQLite as a replaceable index. It keeps recommendations separate from explicitly recorded decisions and can work across multiple model providers.", 458, 568, 350, 86, { fontSize: 12.5, color: C.navy, lineSpacing: 1.1 });
  rich(slide, "s7-source", [[{ run: "Source: ", textStyle: { bold: true, color: C.coral } }, { run: "Current Themis product build and repository documentation, September 2026.", textStyle: { color: C.gray } }]], 848, 568, 338, 60, { fontSize: 12.5, color: C.gray, lineSpacing: 1.08 });
  footer(slide, 7, false);
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${SCREENSHOT}`,
    `${ROOT}/docs/PRD.md`,
    `${ROOT}/docs/ARCHITECTURE.md`,
    `${ROOT}/docs/IMPLEMENTATION_STATUS.md`,
  ]);
}

// Slide 8 — Product character
{
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  title(slide, 8, "Trust is earned by how the product behaves.", { fontSize: 44, kickerColor: C.cobalt, h: 72 });
  text(slide, "s8-context", "Themis should feel like a capable colleague whose conduct makes the lawyer stronger.", 54, 140, 900, 36, { fontSize: 20, bold: true, typeface: SERIF });
  const behaviors = [
    ["Humble, not performative.", "It shows uncertainty and does not pretend that ambiguity has disappeared."],
    ["Curious, not merely declarative.", "It asks the question that exposes the missing fact or untested assumption."],
    ["Present, not intrusive.", "It is available throughout the matter without taking control of the decision."],
    ["Persistent, not forgetful.", "It carries context forward so the lawyer does not have to reconstruct the matter each time."],
    ["Supportive, not substitutive.", "It strengthens the lawyer's judgment instead of presenting itself as the legal authority."],
    ["Faithful, not revisionist.", "It records the lawyer's decision without silently turning a model recommendation into that decision."],
  ];
  behaviors.forEach((b, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 54 + col * 604;
    const y = 202 + row * 108;
    text(slide, `s8-index-${i}`, String(i + 1).padStart(2, "0"), x, y, 32, 24, { fontSize: 12, bold: true, color: col ? C.coral : C.cobalt, lineSpacing: 1 });
    text(slide, `s8-head-${i}`, b[0], x + 42, y - 2, 520, 28, { fontSize: 18, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 1.02 });
    text(slide, `s8-body-${i}`, b[1], x + 42, y + 32, 520, 50, { fontSize: 14.5, color: C.navy, lineSpacing: 1.12 });
    rule(slide, x + 42, y + 88, 520, "#16233F3A", 1);
  });
  rect(slide, "s8-bottom", 0, 540, W, 180, C.navy);
  text(slide, "s8-closing", "This is what it means for Themis not to be a soulless product: its values appear in repeated, observable behavior.", 54, 568, 560, 86, { fontSize: 22, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.08 });
  kicker(slide, "s8-investor-kicker", "Investor implication", 684, 570, 220, C.yellow);
  text(slide, "s8-investor", "These behaviors turn the emotional promise into product requirements. If they remain consistent across models and matters, the ethos can become part of the user experience rather than branding placed on top of it.", 684, 602, 520, 68, { fontSize: 15.5, color: C.white, lineSpacing: 1.12 });
  notes(slide, [`${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`]);
}

// Slide 9 — The defensible leap
{
  const slide = deck.slides.add();
  image(slide, "s9-art", `${ASSET}/defensible-leap.png`, 0, 0, W, H, "cover", "A luminous path becoming coherent through repeated decision points");
  rect(slide, "s9-left", 0, 0, 730, H, "linear(0deg, #16233FF7 0%, #16233FEC 84%, #16233F00 100%)");
  kicker(slide, "s9-kicker", "THEMIS THESIS  /  09", 54, 42, 260, C.aqua);
  text(slide, "s9-title", "The durable position is inside the lawyer's process of reaching confidence.", 54, 70, 620, 122, { fontSize: 38, bold: true, color: C.white, typeface: SERIF, lineSpacing: 0.99 });
  rule(slide, 54, 211, 120, C.yellow, 6);
  text(slide, "s9-quote", "But this is the more important and defensible leap. Intelligence will become common. Workflows can be copied. A product that earns a place inside the lawyer’s process of reaching confidence in their decision can become much harder to replace.", 54, 222, 620, 230, { fontSize: 27, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.05 });
  text(slide, "s9-context", "The market will make strong AI capabilities more available. The investor question is not only which product can generate the best answer today. It is which product can earn a lasting role in the professional process around that answer.", 54, 468, 620, 88, { fontSize: 16, color: C.white, lineSpacing: 1.14 });
  rect(slide, "s9-right-panel", 760, 34, 480, 648, C.white, true);
  kicker(slide, "s9-why", "Why this could matter", 790, 62, 230, C.cobalt);
  const why = [
    "Model quality will improve and useful workflow patterns will spread across products.",
    "Matter history can deepen Themis's role because the system retains how the lawyer and organization reached prior decisions.",
    "Repeated moments of useful challenge, honest uncertainty, and faithful memory can build trust that a feature checklist does not capture.",
  ];
  why.forEach((v, i) => {
    text(slide, `s9-why-num-${i}`, String(i + 1), 790, 96 + i * 64, 24, 24, { fontSize: 12, bold: true, color: C.coral });
    text(slide, `s9-why-text-${i}`, v, 824, 92 + i * 64, 378, 52, { fontSize: 13.5, color: C.navy, lineSpacing: 1.11 });
  });
  rule(slide, 790, 292, 410, C.line, 2);
  kicker(slide, "s9-not-kicker", "What the moat is not", 790, 314, 200, C.coral);
  text(slide, "s9-not", "It is not exclusive intelligence, a fixed workflow, or a claim that lawyers will hand judgment to software.", 790, 344, 410, 50, { fontSize: 14.5, color: C.navy, lineSpacing: 1.12 });
  kicker(slide, "s9-could-kicker", "What the moat could become", 790, 414, 250, C.cobalt);
  text(slide, "s9-could", "A trusted place beside the lawyer, reinforced by accumulated context, product behavior, and repeated proof that Themis illuminates what matters without taking the decision away.", 790, 440, 410, 76, { fontSize: 14.5, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 1.12 });
  kicker(slide, "s9-investor-kicker", "Investor implication", 790, 530, 210, C.coral);
  text(slide, "s9-investor", "The emotional thesis is the proposed source of defensibility: a trusted role strengthened by matter history, repeated use, and behavior that respects the lawyer's responsibility.", 790, 560, 410, 62, { fontSize: 13.5, color: C.navy, lineSpacing: 1.11 });
  rich(slide, "s9-thesis", [[{ run: "Themis thesis: ", textStyle: { bold: true, color: C.cobalt } }, { run: "This is the central strategic leap. It is plausible and supported by interview signals, but it is not yet proven by adoption or retention data.", textStyle: { color: C.gray } }]], 790, 632, 410, 38, { fontSize: 11.5, color: C.gray, lineSpacing: 1.08 });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${ASSET}/defensible-leap.png — original generated illustration for this deck`,
    `${ROOT}/output/research/raw/interviews/in-house-counsel/`,
  ]);
}

// Slide 10 — Assumptions to prove
{
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  title(slide, 10, "We are building on a human thesis, and we should test it directly.", { fontSize: 41, h: 90 });
  rect(slide, "s10-assumption-ground", 54, 154, 1172, 90, C.cobalt, true);
  kicker(slide, "s10-central-kicker", "Central assumption", 80, 174, 200, C.yellow);
  text(slide, "s10-central", "Lawyers will form trust with software that helps them trust their own judgment.", 304, 166, 880, 64, { fontSize: 27, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.04 });
  kicker(slide, "s10-support-kicker", "Supporting assumptions", 54, 274, 230, C.cobalt);
  kicker(slide, "s10-wrong-kicker", "What would prove the thesis wrong", 664, 274, 300, C.coral);
  const assumptions = [
    "The burden of legal judgment often feels lonely, even for experienced lawyers.",
    "Lawyers value help finding blind spots more than another system that simply states an answer.",
    "Confidence grows when the lawyer can see the reasoning, assumptions, sources, and remaining uncertainty.",
    "Persistent matter context and reflective dialogue can turn usefulness into repeat use and trust.",
  ];
  const wrong = [
    "Users value output speed but do not value the process that supports judgment.",
    "Lawyers routinely skip the issue map, questions, uncertainty, and decision history.",
    "Users do not return to existing matters or value preserved context.",
    "Lawyers feel no more prepared to make or defend the call after using Themis—or find general-purpose AI “good enough.”",
  ];
  assumptions.forEach((v, i) => numberedItem(slide, `s10-a-${i}`, i + 1, "", v, 54, 310 + i * 58, 548, { bodySize: 15.5, bodyH: 48 }));
  wrong.forEach((v, i) => {
    text(slide, `s10-wrong-mark-${i}`, "—", 664, 312 + i * 58, 26, 22, { fontSize: 16, bold: true, color: C.coral, lineSpacing: 1 });
    text(slide, `s10-wrong-${i}`, v, 698, 307 + i * 58, 500, 48, { fontSize: 15.5, color: C.navy, lineSpacing: 1.11 });
  });
  rect(slide, "s10-bottom", 0, 560, W, 160, C.navy);
  text(slide, "s10-closing", "Themis wins only if lawyers choose to keep it beside them when the judgment matters.", 54, 586, 520, 68, { fontSize: 23, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1.07 });
  kicker(slide, "s10-near-kicker", "Near-term proof", 664, 586, 170, C.yellow);
  text(slide, "s10-near", "The next stage is not to prove that Themis can generate legal work. It is to measure whether lawyers return to it for consequential matters, discover issues they would otherwise have missed, and feel more ready to make and defend the call.", 664, 616, 548, 72, { fontSize: 14.5, color: C.white, lineSpacing: 1.12 });
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${ROOT}/output/research/raw/legal-ai-reddit-source-corpus.jsonl`,
    `${ROOT}/output/research/raw/interviews/in-house-counsel/`,
  ]);
}

// Appendix — Evidence map
{
  const slide = deck.slides.add();
  slide.background.fill = C.navy2;
  kicker(slide, "appendix-kicker", "APPENDIX", 54, 38, 180, C.yellow);
  text(slide, "appendix-title", "Evidence map", 54, 72, 800, 64, { fontSize: 48, bold: true, color: C.white, typeface: SERIF, lineSpacing: 1 });
  const cols = [
    ["Product and architecture", ["docs/PRD.md", "docs/ARCHITECTURE.md", "docs/IMPLEMENTATION_STATUS.md", "current.md", "Live application screenshots"]],
    ["Market research", ["output/research/raw/legal-ai-reddit-source-corpus.jsonl", "Individual research files in output/research/raw/", "output/research/themis-counselos-legal-ai-competitive-strategy.docx"]],
    ["In-house counsel interviews", ["output/research/raw/interviews/in-house-counsel/brian-jean-2026-08-17-notes-by-gemini.docx", "output/research/raw/interviews/in-house-counsel/brian-ricky-2026-08-22-notes-by-gemini.docx", "output/research/raw/interviews/in-house-counsel/chris-brian-2026-08-24-notes-by-gemini.docx", "output/research/raw/interviews/in-house-counsel/vanessa-petty.docx"]],
  ];
  cols.forEach((col, i) => {
    const x = 54 + i * 396;
    const fills = [C.yellow, C.aqua, C.coral];
    rect(slide, `appendix-card-${i}`, x, 184, 356, 448, C.white, true);
    rect(slide, `appendix-card-top-${i}`, x, 184, 356, 14, fills[i]);
    text(slide, `appendix-head-${i}`, col[0], x + 24, 216, 308, 60, { fontSize: 22, bold: true, color: C.navy, typeface: SERIF, lineSpacing: 1.03 });
    col[1].forEach((item, j) => {
      text(slide, `appendix-bullet-${i}-${j}`, "•", x + 24, 292 + j * 66, 18, 24, { fontSize: 16, bold: true, color: fills[i], lineSpacing: 1 });
      text(slide, `appendix-item-${i}-${j}`, item, x + 50, 288 + j * 66, 278, 60, { fontSize: 12.5, color: C.navy, lineSpacing: 1.08 });
    });
  });
  footer(slide, 11, true);
  notes(slide, [
    `${ROOT}/output/deck/Themis-ai-Companion-Thesis-Deck-Outline.md`,
    `${ROOT}/docs/PRD.md`,
    `${ROOT}/docs/ARCHITECTURE.md`,
    `${ROOT}/docs/IMPLEMENTATION_STATUS.md`,
    `${ROOT}/output/research/raw/legal-ai-reddit-source-corpus.jsonl`,
    `${ROOT}/output/research/raw/interviews/in-house-counsel/`,
  ]);
}

await fs.mkdir(`${TMP}/renders`, { recursive: true });
for (const [index, slide] of deck.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`;
  await writeBlob(`${TMP}/renders/${stem}.png`, await deck.export({ slide, format: "png", scale: 1 }));
  await fs.writeFile(`${TMP}/renders/${stem}.layout.json`, await (await slide.export({ format: "layout" })).text());
}
await writeBlob(`${TMP}/montage.webp`, await deck.export({ format: "webp", montage: true, scale: 1 }));
await fs.writeFile(`${TMP}/inspect.ndjson`, (await deck.inspect({ kind: "slide,textbox,shape,image,notes", maxChars: 50000 })).ndjson);
const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT);
console.log(`Wrote ${OUT}`);
