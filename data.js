window.DATA = {
 "models": [
  {
   "id": "ModernBERT-base",
   "label": "ModernBERT-base",
   "family": "ModernBERT",
   "params_B": 0.149,
   "objective": "MLM",
   "mech": false,
   "adjacent": true
  },
  {
   "id": "ModernBERT-large",
   "label": "ModernBERT-large",
   "family": "ModernBERT",
   "params_B": 0.395,
   "objective": "MLM",
   "mech": true,
   "adjacent": false
  },
  {
   "id": "Qwen2.5-0.5B",
   "label": "Qwen2.5-0.5B",
   "family": "Qwen2.5",
   "params_B": 0.5,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "Qwen2.5-1.5B",
   "label": "Qwen2.5-1.5B",
   "family": "Qwen2.5",
   "params_B": 1.5,
   "objective": "CLM",
   "mech": true,
   "adjacent": true
  },
  {
   "id": "Qwen2.5-3B",
   "label": "Qwen2.5-3B",
   "family": "Qwen2.5",
   "params_B": 3.0,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "Qwen2.5-7B",
   "label": "Qwen2.5-7B",
   "family": "Qwen2.5",
   "params_B": 7.0,
   "objective": "CLM",
   "mech": true,
   "adjacent": true
  },
  {
   "id": "Qwen2.5-7B-Instruct",
   "label": "Qwen2.5-7B-Instruct",
   "family": "Qwen2.5",
   "params_B": 7.0,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "Qwen2.5-14B",
   "label": "Qwen2.5-14B",
   "family": "Qwen2.5",
   "params_B": 14.0,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "SmolLM2-360M",
   "label": "SmolLM2-360M",
   "family": "SmolLM2",
   "params_B": 0.36,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "SmolLM2-1.7B",
   "label": "SmolLM2-1.7B",
   "family": "SmolLM2",
   "params_B": 1.7,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "Phi-3.5-mini",
   "label": "Phi-3.5-mini",
   "family": "Phi-3.5",
   "params_B": 3.8,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "OLMo-2-1B",
   "label": "OLMo-2-1B",
   "family": "OLMo-2",
   "params_B": 1.0,
   "objective": "CLM",
   "mech": false,
   "adjacent": false
  },
  {
   "id": "OLMo-2-7B",
   "label": "OLMo-2-7B",
   "family": "OLMo-2",
   "params_B": 7.0,
   "objective": "CLM",
   "mech": true,
   "adjacent": false
  }
 ],
 "headline": {
  "n_models": 13,
  "n_displaced_inverted": 13,
  "n_mean_inverted_before_30": 12,
  "n_multilingual_cells": 42,
  "n_multilingual_positive": 42,
  "min_drop": 0.137880553922404,
  "max_drop": 0.7331473948803614,
  "min_drop_model": "SmolLM2-1.7B",
  "max_drop_model": "Qwen2.5-14B"
 },
 "workedExample": {
  "model": "Qwen2.5-1.5B",
  "adjacent": [
   {
    "N": 1,
    "p": 0.0007355767318558276
   },
   {
    "N": 3,
    "p": 0.15646601429955354
   },
   {
    "N": 5,
    "p": 0.3209586411504013
   },
   {
    "N": 10,
    "p": 0.3070344121913262
   },
   {
    "N": 20,
    "p": 0.31959307718715735
   },
   {
    "N": 30,
    "p": 0.31936407085444074
   }
  ],
  "displaced_F0": [
   {
    "N": 1,
    "p": 0.018083904807909335
   },
   {
    "N": 3,
    "p": 0.12070524683394979
   },
   {
    "N": 5,
    "p": 0.12517632698950365
   },
   {
    "N": 10,
    "p": 0.09404292774007672
   },
   {
    "N": 20,
    "p": 0.06558753868566924
   },
   {
    "N": 30,
    "p": 0.06190402338739531
   }
  ],
  "peak_N_disp": 5,
  "peak_P_disp": 0.12517632698950365,
  "p_at_30_disp": 0.06190402338739531
 },
 "perModelCurves": {
  "ModernBERT-base": {
   "F0": [
    {
     "N": 1,
     "p": 0.5774109139232896
    },
    {
     "N": 3,
     "p": 0.6675640585860237
    },
    {
     "N": 5,
     "p": 0.6428568057205993
    },
    {
     "N": 10,
     "p": 0.6324454862605781
    },
    {
     "N": 20,
     "p": 0.4937178934920521
    },
    {
     "N": 30,
     "p": 0.37175494411974797
    }
   ]
  },
  "ModernBERT-large": {
   "F0": [
    {
     "N": 1,
     "p": 0.4003210212521954
    },
    {
     "N": 3,
     "p": 0.29459373677961415
    },
    {
     "N": 5,
     "p": 0.28700393637965316
    },
    {
     "N": 10,
     "p": 0.2938531671944947
    },
    {
     "N": 20,
     "p": 0.2500123628989095
    },
    {
     "N": 30,
     "p": 0.2596636073608897
    }
   ]
  },
  "Qwen2.5-0.5B": {
   "F0": [
    {
     "N": 1,
     "p": 0.04978833137799654
    },
    {
     "N": 3,
     "p": 0.18736130169172327
    },
    {
     "N": 5,
     "p": 0.171177080256939
    },
    {
     "N": 10,
     "p": 0.14231309015781335
    },
    {
     "N": 20,
     "p": 0.131714091671995
    },
    {
     "N": 30,
     "p": 0.13168183517436205
    }
   ]
  },
  "Qwen2.5-1.5B": {
   "F0": [
    {
     "N": 1,
     "p": 0.018083904807909335
    },
    {
     "N": 3,
     "p": 0.12070524683394979
    },
    {
     "N": 5,
     "p": 0.12517632698950365
    },
    {
     "N": 10,
     "p": 0.09404292774007672
    },
    {
     "N": 20,
     "p": 0.06558753868566924
    },
    {
     "N": 30,
     "p": 0.06190402338739531
    }
   ]
  },
  "Qwen2.5-3B": {
   "F0": [
    {
     "N": 1,
     "p": 0.030293915359607126
    },
    {
     "N": 3,
     "p": 0.10888871241216691
    },
    {
     "N": 5,
     "p": 0.06045661854449236
    },
    {
     "N": 10,
     "p": 0.03552794026640527
    },
    {
     "N": 20,
     "p": 0.03267042755737748
    },
    {
     "N": 30,
     "p": 0.04036391423960595
    }
   ]
  },
  "Qwen2.5-7B": {
   "F0": [
    {
     "N": 1,
     "p": 0.04023518387020886
    },
    {
     "N": 3,
     "p": 0.12297175647290715
    },
    {
     "N": 5,
     "p": 0.1339757465098046
    },
    {
     "N": 10,
     "p": 0.11940832798700285
    },
    {
     "N": 20,
     "p": 0.11244780347590222
    },
    {
     "N": 30,
     "p": 0.10629922581887286
    }
   ]
  },
  "Qwen2.5-7B-Instruct": {
   "F0": [
    {
     "N": 1,
     "p": 0.06352017977064861
    },
    {
     "N": 3,
     "p": 0.16221725014884214
    },
    {
     "N": 5,
     "p": 0.18563806303609454
    },
    {
     "N": 10,
     "p": 0.20896426087801956
    },
    {
     "N": 20,
     "p": 0.1657731194429175
    },
    {
     "N": 30,
     "p": 0.1545783064156936
    }
   ]
  },
  "Qwen2.5-14B": {
   "F0": [
    {
     "N": 1,
     "p": 0.030635964465972165
    },
    {
     "N": 3,
     "p": 0.22275760499496755
    },
    {
     "N": 5,
     "p": 0.2066165624482892
    },
    {
     "N": 10,
     "p": 0.12619505699240108
    },
    {
     "N": 20,
     "p": 0.0784224457400029
    },
    {
     "N": 30,
     "p": 0.06495431643060101
    }
   ]
  },
  "SmolLM2-360M": {
   "F0": [
    {
     "N": 1,
     "p": 0.00563976998430092
    },
    {
     "N": 3,
     "p": 0.048936914405993064
    },
    {
     "N": 5,
     "p": 0.07921072787446395
    },
    {
     "N": 10,
     "p": 0.10036617720115193
    },
    {
     "N": 20,
     "p": 0.11270028348202644
    },
    {
     "N": 30,
     "p": 0.10044250140344957
    }
   ]
  },
  "SmolLM2-1.7B": {
   "F0": [
    {
     "N": 1,
     "p": 0.004420094228760351
    },
    {
     "N": 3,
     "p": 0.029976784525296556
    },
    {
     "N": 5,
     "p": 0.050321791746316104
    },
    {
     "N": 10,
     "p": 0.06522063501680075
    },
    {
     "N": 20,
     "p": 0.08994619565963557
    },
    {
     "N": 30,
     "p": 0.10109144297397746
    }
   ]
  },
  "Phi-3.5-mini": {
   "F0": [
    {
     "N": 1,
     "p": 0.0014494480365551232
    },
    {
     "N": 3,
     "p": 0.0009951163098906232
    },
    {
     "N": 5,
     "p": 0.0010968119205134936
    },
    {
     "N": 10,
     "p": 0.0010386468629603968
    },
    {
     "N": 20,
     "p": 0.0007043835355813956
    },
    {
     "N": 30,
     "p": 0.0004949299836031
    }
   ]
  },
  "OLMo-2-1B": {
   "F0": [
    {
     "N": 1,
     "p": 0.004030637226520639
    },
    {
     "N": 3,
     "p": 0.017365031492204253
    },
    {
     "N": 5,
     "p": 0.02748349631417568
    },
    {
     "N": 10,
     "p": 0.03795744510739496
    },
    {
     "N": 20,
     "p": 0.03936882471597869
    },
    {
     "N": 30,
     "p": 0.032511643064268014
    }
   ]
  },
  "OLMo-2-7B": {
   "F0": [
    {
     "N": 1,
     "p": 0.004429854175842962
    },
    {
     "N": 3,
     "p": 0.026862300811181683
    },
    {
     "N": 5,
     "p": 0.040537884297997095
    },
    {
     "N": 10,
     "p": 0.05781709780851685
    },
    {
     "N": 20,
     "p": 0.056117612712945686
    },
    {
     "N": 30,
     "p": 0.041815715768777295
    }
   ]
  }
 },
 "forest": [
  {
   "id": "SmolLM2-1.7B",
   "label": "SmolLM2-1.7B",
   "family": "SmolLM2",
   "params_B": 1.7,
   "objective": "CLM",
   "peak_N": 30,
   "peak_P": 0.1010914429739774,
   "p_at_30": 0.1010914429739774,
   "drop": 0.137880553922404,
   "ci_lo": 0.1141979890864442,
   "ci_hi": 0.1637614400863415,
   "n_words": 258
  },
  {
   "id": "SmolLM2-360M",
   "label": "SmolLM2-360M",
   "family": "SmolLM2",
   "params_B": 0.36,
   "objective": "CLM",
   "peak_N": 20,
   "peak_P": 0.1127002834820264,
   "p_at_30": 0.1004425014034495,
   "drop": 0.3270487640947624,
   "ci_lo": 0.290598255991837,
   "ci_hi": 0.3669220321242112,
   "n_words": 258
  },
  {
   "id": "Qwen2.5-0.5B",
   "label": "Qwen2.5-0.5B",
   "family": "Qwen2.5",
   "params_B": 0.5,
   "objective": "CLM",
   "peak_N": 3,
   "peak_P": 0.1873613016917232,
   "p_at_30": 0.131681835174362,
   "drop": 0.3294990678860942,
   "ci_lo": 0.2937124613349805,
   "ci_hi": 0.3632284329938943,
   "n_words": 256
  },
  {
   "id": "ModernBERT-large",
   "label": "ModernBERT-large",
   "family": "ModernBERT",
   "params_B": 0.395,
   "objective": "MLM",
   "peak_N": 1,
   "peak_P": 0.4003210212521954,
   "p_at_30": 0.2596636073608897,
   "drop": 0.4227749599758146,
   "ci_lo": 0.3881781202314786,
   "ci_hi": 0.4616143296959388,
   "n_words": 250
  },
  {
   "id": "OLMo-2-7B",
   "label": "OLMo-2-7B",
   "family": "OLMo-2",
   "params_B": 7.0,
   "objective": "CLM",
   "peak_N": 10,
   "peak_P": 0.0578170978085168,
   "p_at_30": 0.0418157157687772,
   "drop": 0.4262973541213655,
   "ci_lo": 0.3851413977775649,
   "ci_hi": 0.4683233191626175,
   "n_words": 256
  },
  {
   "id": "OLMo-2-1B",
   "label": "OLMo-2-1B",
   "family": "OLMo-2",
   "params_B": 1.0,
   "objective": "CLM",
   "peak_N": 20,
   "peak_P": 0.0393688247159786,
   "p_at_30": 0.032511643064268,
   "drop": 0.4339651812444577,
   "ci_lo": 0.3871809328708778,
   "ci_hi": 0.4722098841253513,
   "n_words": 256
  },
  {
   "id": "Qwen2.5-3B",
   "label": "Qwen2.5-3B",
   "family": "Qwen2.5",
   "params_B": 3.0,
   "objective": "CLM",
   "peak_N": 3,
   "peak_P": 0.1088887124121669,
   "p_at_30": 0.0403639142396059,
   "drop": 0.434022796180447,
   "ci_lo": 0.3973426074099034,
   "ci_hi": 0.4768907696193416,
   "n_words": 256
  },
  {
   "id": "Qwen2.5-7B",
   "label": "Qwen2.5-7B",
   "family": "Qwen2.5",
   "params_B": 7.0,
   "objective": "CLM",
   "peak_N": 5,
   "peak_P": 0.1339757465098046,
   "p_at_30": 0.1062992258188728,
   "drop": 0.4606138120186722,
   "ci_lo": 0.4222934001124904,
   "ci_hi": 0.5024099243040294,
   "n_words": 256
  },
  {
   "id": "ModernBERT-base",
   "label": "ModernBERT-base",
   "family": "ModernBERT",
   "params_B": 0.149,
   "objective": "MLM",
   "peak_N": 3,
   "peak_P": 0.6675640585860237,
   "p_at_30": 0.3717549441197479,
   "drop": 0.5156609398092655,
   "ci_lo": 0.4811343450322204,
   "ci_hi": 0.5490742908598862,
   "n_words": 250
  },
  {
   "id": "Phi-3.5-mini",
   "label": "Phi-3.5-mini",
   "family": "Phi-3.5",
   "params_B": 3.8,
   "objective": "CLM",
   "peak_N": 1,
   "peak_P": 0.0014494480365551,
   "p_at_30": 0.0004949299836031,
   "drop": 0.5229724631928687,
   "ci_lo": 0.4850372890173768,
   "ci_hi": 0.5583062381950445,
   "n_words": 182
  },
  {
   "id": "Qwen2.5-7B-Instruct",
   "label": "Qwen2.5-7B-Instruct",
   "family": "Qwen2.5",
   "params_B": 7.0,
   "objective": "CLM",
   "peak_N": 10,
   "peak_P": 0.2089642608780195,
   "p_at_30": 0.1545783064156936,
   "drop": 0.5493202832022507,
   "ci_lo": 0.5073178420690666,
   "ci_hi": 0.5922406651982296,
   "n_words": 256
  },
  {
   "id": "Qwen2.5-1.5B",
   "label": "Qwen2.5-1.5B",
   "family": "Qwen2.5",
   "params_B": 1.5,
   "objective": "CLM",
   "peak_N": 5,
   "peak_P": 0.1251763269895036,
   "p_at_30": 0.0619040233873953,
   "drop": 0.6928838933604375,
   "ci_lo": 0.6538262266269699,
   "ci_hi": 0.7333264538451468,
   "n_words": 256
  },
  {
   "id": "Qwen2.5-14B",
   "label": "Qwen2.5-14B",
   "family": "Qwen2.5",
   "params_B": 14.0,
   "objective": "CLM",
   "peak_N": 3,
   "peak_P": 0.2227576049949675,
   "p_at_30": 0.064954316430601,
   "drop": 0.7331473948803614,
   "ci_lo": 0.7055477890451826,
   "ci_hi": 0.761250464293235,
   "n_words": 256
  }
 ],
 "ablation": {
  "conditions": [
   {
    "code": "full_repeat_N30",
    "label": "Full target \u00d730"
   },
   {
    "code": "truncate_to_N3",
    "label": "Truncated \u00d73"
   },
   {
    "code": "delete_repeat_block",
    "label": "Block deleted"
   },
   {
    "code": "random_filler_same_length",
    "label": "Random filler \u00d730"
   },
   {
    "code": "unique_semantic_filler",
    "label": "Semantic neighbours \u00d730"
   },
   {
    "code": "repeat_unrelated_N30",
    "label": "\u2018table\u2019 \u00d730"
   }
  ],
  "models": [
   "ModernBERT-large",
   "Qwen2.5-1.5B",
   "Qwen2.5-7B",
   "OLMo-2-7B"
  ],
  "p_target": {
   "ModernBERT-large": {
    "full_repeat_N30": 0.2599183992465041,
    "truncate_to_N3": 0.2943847068294126,
    "delete_repeat_block": 0.00046446985576847053,
    "random_filler_same_length": 0.0008114135448547586,
    "unique_semantic_filler": 0.031023008963933937,
    "repeat_unrelated_N30": 0.0008998006379282657
   },
   "Qwen2.5-1.5B": {
    "full_repeat_N30": 0.0615647189895121,
    "truncate_to_N3": 0.1209060329579188,
    "delete_repeat_block": 0.00013911732307114733,
    "random_filler_same_length": 0.000428853921461983,
    "unique_semantic_filler": 0.01174775103887392,
    "repeat_unrelated_N30": 0.00015382187679024995
   },
   "Qwen2.5-7B": {
    "full_repeat_N30": 0.10861667434591027,
    "truncate_to_N3": 0.12391407009818067,
    "delete_repeat_block": 9.829645166314904e-05,
    "random_filler_same_length": 0.0005060665937175468,
    "unique_semantic_filler": 0.013342681683826487,
    "repeat_unrelated_N30": 0.00029586393905167707
   },
   "OLMo-2-7B": {
    "full_repeat_N30": 0.041825557737908525,
    "truncate_to_N3": 0.02689110001525563,
    "delete_repeat_block": 9.223849829265163e-05,
    "random_filler_same_length": 0.0005389101350381509,
    "unique_semantic_filler": 0.013059270402614807,
    "repeat_unrelated_N30": 0.00012822626782948987
   }
  },
  "p_synonyms": {
   "ModernBERT-large": {
    "full_repeat_N30": 0.015153302552385462,
    "truncate_to_N3": 0.027039409421073895,
    "delete_repeat_block": 0.0020518625759804207,
    "random_filler_same_length": 0.003742069467585275,
    "unique_semantic_filler": 0.31605116422805524,
    "repeat_unrelated_N30": 0.0007314855780956956
   },
   "Qwen2.5-1.5B": {
    "full_repeat_N30": 0.0028443184627748625,
    "truncate_to_N3": 0.005125127303275607,
    "delete_repeat_block": 0.0005854805992409663,
    "random_filler_same_length": 0.0015439058564928978,
    "unique_semantic_filler": 0.153475046560571,
    "repeat_unrelated_N30": 0.00045038207600874876
   },
   "Qwen2.5-7B": {
    "full_repeat_N30": 0.0030390684342647373,
    "truncate_to_N3": 0.004900973632371657,
    "delete_repeat_block": 0.0004276557561211489,
    "random_filler_same_length": 0.0027696434561811337,
    "unique_semantic_filler": 0.16436593496316187,
    "repeat_unrelated_N30": 0.00035091336954989145
   },
   "OLMo-2-7B": {
    "full_repeat_N30": 0.006447337140687867,
    "truncate_to_N3": 0.0061716251216854,
    "delete_repeat_block": 0.0004378446183919378,
    "random_filler_same_length": 0.0018059566872260483,
    "unique_semantic_filler": 0.1044920065968826,
    "repeat_unrelated_N30": 0.00029676420436354
   }
  }
 },
 "multilingual": {
  "models": [
   "XLM-R-base",
   "XLM-R-large",
   "Qwen2.5-1.5B",
   "Qwen2.5-7B"
  ],
  "langs": [
   "Spanish",
   "Chinese",
   "German",
   "French"
  ],
  "frames": [
   "F0",
   "F1",
   "F2"
  ],
  "cells": [
   {
    "model": "Qwen2.5-1.5B",
    "lang": "German",
    "frame": "F0",
    "drop": 0.8139396653861671,
    "ci_lo": 0.7183078007801668,
    "ci_hi": 0.8926274284069964,
    "peak_N": 5,
    "peak_P": 0.1919612912835353,
    "p_at_30": 0.0566754614805436,
    "n_words": 28
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "German",
    "frame": "F1",
    "drop": 0.624192375469421,
    "ci_lo": 0.5346577185800347,
    "ci_hi": 0.7136061656286697,
    "peak_N": 5,
    "peak_P": 0.036076857282751,
    "p_at_30": 0.0122130343136502,
    "n_words": 28
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "German",
    "frame": "F2",
    "drop": 0.1119357346022105,
    "ci_lo": 0.0337976989767458,
    "ci_hi": 0.2138423004399343,
    "peak_N": 30,
    "peak_P": 0.141981790927405,
    "p_at_30": 0.141981790927405,
    "n_words": 28
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "Spanish",
    "frame": "F0",
    "drop": 0.853036074051063,
    "ci_lo": 0.7845935821347296,
    "ci_hi": 0.9090723019632444,
    "peak_N": 5,
    "peak_P": 0.1990753126412849,
    "p_at_30": 0.0447848514624424,
    "n_words": 34
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "Spanish",
    "frame": "F1",
    "drop": 0.5790187699124756,
    "ci_lo": 0.4792481376563397,
    "ci_hi": 0.6688051021507189,
    "peak_N": 5,
    "peak_P": 0.0030633687610508,
    "p_at_30": 0.0025660112770738,
    "n_words": 34
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "Spanish",
    "frame": "F2",
    "drop": 0.6840805341875074,
    "ci_lo": 0.5997099930314482,
    "ci_hi": 0.7609954201374014,
    "peak_N": 5,
    "peak_P": 0.0005868728348078,
    "p_at_30": 0.0001605476221149,
    "n_words": 34
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "French",
    "frame": "F0",
    "drop": 0.776919736066346,
    "ci_lo": 0.6859043495414698,
    "ci_hi": 0.8605391586657445,
    "peak_N": 3,
    "peak_P": 0.1045884478010301,
    "p_at_30": 0.0336516531542342,
    "n_words": 29
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "French",
    "frame": "F1",
    "drop": 0.4812537226368369,
    "ci_lo": 0.3607829030224754,
    "ci_hi": 0.6081650824933349,
    "peak_N": 30,
    "peak_P": 0.0018450844648543,
    "p_at_30": 0.0018450844648543,
    "n_words": 29
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "French",
    "frame": "F2",
    "drop": 0.568339603225693,
    "ci_lo": 0.4642549726640759,
    "ci_hi": 0.6798869093529246,
    "peak_N": 30,
    "peak_P": 0.0008498765807714,
    "p_at_30": 0.0008498765807714,
    "n_words": 29
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "Chinese",
    "frame": "F0",
    "drop": 0.4810410982230664,
    "ci_lo": 0.4113884566395263,
    "ci_hi": 0.5492101706863836,
    "peak_N": 3,
    "peak_P": 0.006695883913436,
    "p_at_30": 0.0060496072134012,
    "n_words": 49
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "Chinese",
    "frame": "F1",
    "drop": 0.3672358670390473,
    "ci_lo": 0.2870004792448651,
    "ci_hi": 0.4506444055975814,
    "peak_N": 3,
    "peak_P": 0.0067664781509309,
    "p_at_30": 0.0057158963597374,
    "n_words": 49
   },
   {
    "model": "Qwen2.5-1.5B",
    "lang": "Chinese",
    "frame": "F2",
    "drop": 0.3842976442163771,
    "ci_lo": 0.2982055708134727,
    "ci_hi": 0.472273788343248,
    "peak_N": 10,
    "peak_P": 0.0068944323979014,
    "p_at_30": 0.0066144071615595,
    "n_words": 49
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "German",
    "frame": "F0",
    "drop": 0.4787174287042793,
    "ci_lo": 0.366155051062863,
    "ci_hi": 0.5829443547331484,
    "peak_N": 10,
    "peak_P": 0.2285989649327738,
    "p_at_30": 0.1524977813075695,
    "n_words": 28
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "German",
    "frame": "F1",
    "drop": 0.6100480470561945,
    "ci_lo": 0.5267261732757407,
    "ci_hi": 0.7055541248887063,
    "peak_N": 5,
    "peak_P": 0.0403325709703494,
    "p_at_30": 0.0185605324285071,
    "n_words": 28
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "German",
    "frame": "F2",
    "drop": 0.116837574094637,
    "ci_lo": 0.0474332875129735,
    "ci_hi": 0.2032901417801871,
    "peak_N": 30,
    "peak_P": 0.0866978830225499,
    "p_at_30": 0.0866978830225499,
    "n_words": 28
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "Spanish",
    "frame": "F0",
    "drop": 0.7324657913002588,
    "ci_lo": 0.6457426124489064,
    "ci_hi": 0.8081762800813296,
    "peak_N": 5,
    "peak_P": 0.191979001440546,
    "p_at_30": 0.063641956918325,
    "n_words": 34
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "Spanish",
    "frame": "F1",
    "drop": 0.4479347007208063,
    "ci_lo": 0.3739728613352113,
    "ci_hi": 0.527229978568225,
    "peak_N": 5,
    "peak_P": 0.0100553615879214,
    "p_at_30": 0.0064539779326985,
    "n_words": 34
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "Spanish",
    "frame": "F2",
    "drop": 0.3050957988877484,
    "ci_lo": 0.2221520096903055,
    "ci_hi": 0.4003245276278237,
    "peak_N": 20,
    "peak_P": 0.0006025739027008,
    "p_at_30": 0.0006019843040121,
    "n_words": 34
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "French",
    "frame": "F0",
    "drop": 0.4858929070743819,
    "ci_lo": 0.3916758576941734,
    "ci_hi": 0.5868735015475274,
    "peak_N": 5,
    "peak_P": 0.1522927575198741,
    "p_at_30": 0.0885575647738858,
    "n_words": 29
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "French",
    "frame": "F1",
    "drop": 0.3784813984459325,
    "ci_lo": 0.2908256153466022,
    "ci_hi": 0.4520759604206714,
    "peak_N": 5,
    "peak_P": 0.0068855505279347,
    "p_at_30": 0.004803360609442,
    "n_words": 29
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "French",
    "frame": "F2",
    "drop": 0.2017585146112706,
    "ci_lo": 0.1122860633592133,
    "ci_hi": 0.3060103776878102,
    "peak_N": 30,
    "peak_P": 0.0018160174761854,
    "p_at_30": 0.0018160174761854,
    "n_words": 29
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "Chinese",
    "frame": "F0",
    "drop": 0.4351735461212093,
    "ci_lo": 0.3857790320989742,
    "ci_hi": 0.4826058110319839,
    "peak_N": 5,
    "peak_P": 0.0272437349717341,
    "p_at_30": 0.019210287243869,
    "n_words": 49
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "Chinese",
    "frame": "F1",
    "drop": 0.5754624106473046,
    "ci_lo": 0.504492765654139,
    "ci_hi": 0.6390699756063062,
    "peak_N": 3,
    "peak_P": 0.0119435698844074,
    "p_at_30": 0.0072718175028317,
    "n_words": 49
   },
   {
    "model": "Qwen2.5-7B",
    "lang": "Chinese",
    "frame": "F2",
    "drop": 0.387418303832077,
    "ci_lo": 0.3211421373489448,
    "ci_hi": 0.4553763683773476,
    "peak_N": 5,
    "peak_P": 0.027384779974343,
    "p_at_30": 0.0223562852289451,
    "n_words": 49
   },
   {
    "model": "XLM-R-base",
    "lang": "German",
    "frame": "F0",
    "drop": 0.5154287678985016,
    "ci_lo": 0.4119980867501716,
    "ci_hi": 0.6175095177966922,
    "peak_N": 1,
    "peak_P": 0.7837662346985029,
    "p_at_30": 0.3990035819006152,
    "n_words": 46
   },
   {
    "model": "XLM-R-base",
    "lang": "German",
    "frame": "F1",
    "drop": 0.5610248697579224,
    "ci_lo": 0.4647411048749761,
    "ci_hi": 0.6620700556952155,
    "peak_N": 1,
    "peak_P": 0.3019033868432693,
    "p_at_30": 0.1921125132889163,
    "n_words": 46
   },
   {
    "model": "XLM-R-base",
    "lang": "German",
    "frame": "F2",
    "drop": 0.5023220960887252,
    "ci_lo": 0.4099931708080123,
    "ci_hi": 0.5833252268791737,
    "peak_N": 20,
    "peak_P": 0.0064454344729987,
    "p_at_30": 0.0034380757843277,
    "n_words": 46
   },
   {
    "model": "XLM-R-base",
    "lang": "Spanish",
    "frame": "F0",
    "drop": 0.5407782414232308,
    "ci_lo": 0.4312012034189124,
    "ci_hi": 0.6363843420248908,
    "peak_N": 1,
    "peak_P": 0.4923829745349227,
    "p_at_30": 0.2933209484849334,
    "n_words": 49
   },
   {
    "model": "XLM-R-base",
    "lang": "Spanish",
    "frame": "F1",
    "drop": 0.736553824282826,
    "ci_lo": 0.6645971624152468,
    "ci_hi": 0.8030117838706542,
    "peak_N": 1,
    "peak_P": 0.2100411027204245,
    "p_at_30": 0.0825805108238733,
    "n_words": 49
   },
   {
    "model": "XLM-R-base",
    "lang": "Spanish",
    "frame": "F2",
    "drop": 0.5387294511995686,
    "ci_lo": 0.4420214667198754,
    "ci_hi": 0.6300422685106567,
    "peak_N": 20,
    "peak_P": 0.0623754182288765,
    "p_at_30": 0.050717346426052,
    "n_words": 49
   },
   {
    "model": "XLM-R-base",
    "lang": "French",
    "frame": "F0",
    "drop": 0.8228000352228815,
    "ci_lo": 0.7310061389990856,
    "ci_hi": 0.9028813415674162,
    "peak_N": 1,
    "peak_P": 0.4423205057857558,
    "p_at_30": 0.0780056840478209,
    "n_words": 40
   },
   {
    "model": "XLM-R-base",
    "lang": "French",
    "frame": "F1",
    "drop": 0.5730750236231449,
    "ci_lo": 0.4465622555797397,
    "ci_hi": 0.6858916029362047,
    "peak_N": 10,
    "peak_P": 0.0630690735793905,
    "p_at_30": 0.0311272577886484,
    "n_words": 40
   },
   {
    "model": "XLM-R-base",
    "lang": "French",
    "frame": "F2",
    "drop": 0.543479670199473,
    "ci_lo": 0.4319896401291934,
    "ci_hi": 0.6514470255822185,
    "peak_N": 1,
    "peak_P": 0.0882319065925912,
    "p_at_30": 0.0554767265515693,
    "n_words": 40
   },
   {
    "model": "XLM-R-large",
    "lang": "German",
    "frame": "F0",
    "drop": 0.3538156378607162,
    "ci_lo": 0.2569317906530126,
    "ci_hi": 0.454680889616507,
    "peak_N": 30,
    "peak_P": 0.2651403442495907,
    "p_at_30": 0.2651403442495907,
    "n_words": 46
   },
   {
    "model": "XLM-R-large",
    "lang": "German",
    "frame": "F1",
    "drop": 0.5607414297676963,
    "ci_lo": 0.455214021002404,
    "ci_hi": 0.6709120504989893,
    "peak_N": 1,
    "peak_P": 0.0370911157565981,
    "p_at_30": 0.0341723449599395,
    "n_words": 46
   },
   {
    "model": "XLM-R-large",
    "lang": "German",
    "frame": "F2",
    "drop": 0.8694285115367724,
    "ci_lo": 0.7934637045344884,
    "ci_hi": 0.929367322638025,
    "peak_N": 1,
    "peak_P": 0.0087525716629126,
    "p_at_30": 0.000857728079101,
    "n_words": 46
   },
   {
    "model": "XLM-R-large",
    "lang": "Spanish",
    "frame": "F0",
    "drop": 0.3076228525832664,
    "ci_lo": 0.2185399321472,
    "ci_hi": 0.3890410434721944,
    "peak_N": 30,
    "peak_P": 0.2070188891826843,
    "p_at_30": 0.2070188891826843,
    "n_words": 49
   },
   {
    "model": "XLM-R-large",
    "lang": "Spanish",
    "frame": "F1",
    "drop": 0.3722683185108506,
    "ci_lo": 0.2726278915726134,
    "ci_hi": 0.4791975378244527,
    "peak_N": 30,
    "peak_P": 0.0447160861781876,
    "p_at_30": 0.0447160861781876,
    "n_words": 49
   },
   {
    "model": "XLM-R-large",
    "lang": "Spanish",
    "frame": "F2",
    "drop": 0.749464182806916,
    "ci_lo": 0.6560821098992339,
    "ci_hi": 0.8303744176588725,
    "peak_N": 30,
    "peak_P": 0.0023689158178128,
    "p_at_30": 0.0023689158178128,
    "n_words": 49
   },
   {
    "model": "XLM-R-large",
    "lang": "French",
    "frame": "F0",
    "drop": 0.4425310874408639,
    "ci_lo": 0.3354969216294942,
    "ci_hi": 0.554556553551299,
    "peak_N": 30,
    "peak_P": 0.2083269266357092,
    "p_at_30": 0.2083269266357092,
    "n_words": 40
   },
   {
    "model": "XLM-R-large",
    "lang": "French",
    "frame": "F1",
    "drop": 0.1152465594273997,
    "ci_lo": 0.0621289536752653,
    "ci_hi": 0.1810716016033684,
    "peak_N": 30,
    "peak_P": 0.0119588272527835,
    "p_at_30": 0.0119588272527835,
    "n_words": 40
   },
   {
    "model": "XLM-R-large",
    "lang": "French",
    "frame": "F2",
    "drop": 0.6387575010611727,
    "ci_lo": 0.5082387570540053,
    "ci_hi": 0.7564484051538992,
    "peak_N": 30,
    "peak_P": 0.0036216347982929,
    "p_at_30": 0.0036216347982929,
    "n_words": 40
   }
  ]
 },
 "attention": {
  "Ns": [
   3,
   5,
   10,
   20,
   30
  ],
  "byModel": {
   "Qwen2.5-1.5B": {
    "per_token": [
     0.054,
     0.035,
     0.026,
     0.02,
     0.016
    ],
    "ref_1_over_N": [
     0.054,
     0.033,
     0.016,
     0.008,
     0.005
    ],
    "total_block": [
     0.109,
     0.141,
     0.235,
     0.383,
     0.471
    ],
    "objective": "CLM"
   },
   "Qwen2.5-7B": {
    "per_token": [
     0.031,
     0.04,
     0.024,
     0.013,
     0.01
    ],
    "ref_1_over_N": [
     0.031,
     0.018,
     0.009,
     0.005,
     0.003
    ],
    "total_block": [
     0.061,
     0.159,
     0.214,
     0.246,
     0.292
    ],
    "objective": "CLM"
   },
   "OLMo-2-7B": {
    "per_token": [
     0.015,
     0.011,
     0.007,
     0.006,
     0.008
    ],
    "ref_1_over_N": [
     0.015,
     0.009,
     0.004,
     0.002,
     0.002
    ],
    "total_block": [
     0.03,
     0.045,
     0.067,
     0.122,
     0.242
    ],
    "objective": "CLM"
   },
   "ModernBERT-large": {
    "per_token": [
     0.044,
     0.026,
     0.017,
     0.008,
     0.005
    ],
    "ref_1_over_N": [
     0.044,
     0.027,
     0.013,
     0.007,
     0.004
    ],
    "total_block": [
     0.089,
     0.105,
     0.15,
     0.157,
     0.143
    ],
    "objective": "MLM"
   }
  }
 },
 "boundary": {
  "smollm2": [
   {
    "id": "SmolLM2-360M",
    "layers": 32,
    "hidden": 960,
    "params": "360M",
    "drop": 0.327
   },
   {
    "id": "SmolLM2-1.7B",
    "layers": 24,
    "hidden": 2048,
    "params": "1.7B",
    "drop": 0.138
   }
  ],
  "bert_turc": [
   {
    "id": "BERT-tiny",
    "layers": 2,
    "hidden": 128,
    "params": "4.4M",
    "drop": 0.001,
    "ci": [
     0.0,
     0.003
    ]
   },
   {
    "id": "BERT-mini",
    "layers": 4,
    "hidden": 256,
    "params": "11M",
    "drop": 0.521,
    "ci": [
     0.471,
     0.565
    ]
   },
   {
    "id": "BERT-small",
    "layers": 4,
    "hidden": 512,
    "params": "29M",
    "drop": 0.478,
    "ci": [
     0.426,
     0.528
    ]
   }
  ]
 },
 "Ns": [
  1,
  3,
  5,
  10,
  20,
  30
 ]
};
