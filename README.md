# Project page — *When More Becomes Less*

Static project page for the paper *When More Becomes Less: A Two-Probe Diagnostic
for Repetition in Language Models*.

Five files. No CDN dependencies. Runs offline.

## Files

| File         | Purpose |
|---|---|
| `index.html` | Semantic structure: 10 narrative sections |
| `styles.css` | Cream / warm-light editorial theme |
| `app.js`     | D3 visualisations + interactivity |
| `data.js`    | `window.DATA` — every number on the page, baked in from the CSVs |
| `d3.min.js`  | Bundled D3 v7 (no CDN) |
| `extract_data.py` | Regenerates `data.js` from `../results/` (run after data changes) |

## Serve

```bash
cd project-page/
python3 -m http.server 8765
# open http://localhost:8765
```

Works on `file://` too if you just want to double-click `index.html`.

## Regenerate data after experiments rerun

```bash
python3 extract_data.py
```

This reads from `../results/english_panel/summary/`, `../results/multilingual_panel/summary/`,
and the per-model parquet files, and writes `data.js` in place.
The page picks up the new data on next reload.

## Narrative structure

| § | id              | beat |
|---|---|---|
| 01 | `#setup`        | The two probes (adjacent vs displaced) |
| 02 | `#test`         | Worked example: Qwen2.5-1.5B adjacent vs displaced curves |
| 03 | `#pattern`      | Per-model picker — the inverted-U shape across the panel |
| 04 | `#everywhere`   | Forest plot of 13 models with bootstrap CIs |
| 05 | `#cause`        | Six-condition causal ablation |
| 06 | `#crosslingual` | 4-language × 4-model heatmap (42 cells) |
| 07 | `#inside`       | Attention budget growth in CLMs (MLM stays flat) |
| 08 | `#boundary`     | SmolLM2 + BERT-tiny depth-vs-width contrasts |
| 09 | `#meaning`      | Methodological consequence |
| 10 | `#cite`         | BibTeX |
