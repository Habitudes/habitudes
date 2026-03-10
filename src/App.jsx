import { useState, useEffect, useRef, useCallback } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from "recharts";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const LOGO  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA7MAAAETCAYAAADknVGoAABdz0lEQVR4nO3dTWwb17k//i/NESWSE5lSQjGOUt4RIiG317wNbcPX2fqi2y5loAXkzV111axl4C4uYK+TVVfdWEALyMtu/oviehvVsM201K8NpMC8rBWXmkSkneGLx0Pzv/AZhab4Pmc4M+T3AxSN9TI84nBmznOec54TarVaICIiIiIiIgqSc143gIiIiIiIiGhUDGaJiIiIiIgocBjMEhERERERUeAwmCUiIiIiIqLAYTBLREREREREgcNgloiIiIiIiAKHwSwREREREREFDoNZIiIiIiIiChwGs0RERERERBQ4DGaJiIiIiIgocBjMEhERERERUeAoo/6CmtFa47yQkS+Exvk9IiIiIiIiok7MzBIREREREVHgMJglIiIiIiKiwGEwS0RERERERIHDYJaIiIiIiIgCh8EsERERERERBQ6DWSIiIiIiIgocBrNEREREREQUOAxmiYiIiIiIKHAYzBIREREREVHgMJglIiIiIiKiwGEwS0RERERERIHDYJaIiIiIiIgCh8EsERERERERBQ6DWSIiIiIiIgocBrNEREREREQUOAxmiYiIiIiIKHAYzBIREREREVHgMJglIiIiIiKiwGEwS0RERERERIHDYJaIiIiIiIgCR/G6Ab0oi7HWQnpl7N9vFI9hvaiFJDaJKDDUjNZyeIgdI1+4KaUxFDhOPz9GvsB7LxG5iv1EIgJ8HMwSERERERFRcFiWhUR2fcn+d2lvvxyPx117PU4zJiIi8inLsrxuAhERUV9qRts8Nz/Xin70QSuRXW8BOLH/l7p2saVmtJayGGupGW1b9nONwSwREZEPqRlt852P006XDBAREblC13VEkudbAHZjG6sIRyM9f1YsC7j9zsfplprRLstqA6cZExER+Yiu67jw0b+0FtIrfTsGREREXhBTiR8DyEZSS2e/XzFgvajh3PwcOr8vnmsPz83PwazWQ4riLBxlZpaIiMgHLMuCmtEer12/6qiwDRERkVt0XYeqvd8CkO34VhPAciV3GGo8/S5kvaiFTP15qJI7DAFYBpBr1s3TH45trEJkaTedtIeZWSIiIo+pGW2zWTd3mYklIiK/siwLP7n005aSUH/8WsWAklCXjXyh3O13FEWB+N4lXdex+m/rLTtbG45G0Kyb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";
const GREEN = "#0B2B1F";
const FF    = "'Inter','SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_ENTRIES = {"2025-03-07": {"spirit": 1, "body": -1, "vocation": 1, "bond": 2, "shape": -1}, "2025-03-08": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": -1}, "2025-03-09": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-03-10": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-03-11": {"spirit": 1, "body": -1, "vocation": 1, "bond": 0, "shape": 0}, "2025-03-12": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-03-13": {"spirit": 1, "body": -1, "vocation": 1, "bond": 0, "shape": -1}, "2025-03-14": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": -1}, "2025-03-15": {"spirit": 0, "body": -1, "vocation": 0, "bond": 2, "shape": -1}, "2025-03-16": {"spirit": 2, "body": -1, "vocation": 0, "bond": 1, "shape": -1}, "2025-03-17": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-03-18": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-03-19": {"spirit": 1, "body": -1, "vocation": 0, "bond": 0, "shape": 0}, "2025-03-20": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-03-22": {"spirit": 1, "body": -1, "vocation": 0, "bond": 1, "shape": -1}, "2025-03-23": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-03-24": {"spirit": 1, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-03-25": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-03-26": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-03-29": {"spirit": 2, "body": -1, "vocation": 1, "bond": 2, "shape": 0}, "2025-03-30": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": -1}, "2025-03-31": {"spirit": 0, "body": 0, "vocation": -1, "bond": 0, "shape": 0}, "2025-04-01": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-04-02": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-04-03": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-04-04": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": -1}, "2025-04-05": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-04-06": {"spirit": 1, "body": -1, "vocation": 0, "bond": 1, "shape": -1}, "2025-04-07": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-04-08": {"spirit": 1, "body": 1, "vocation": -1, "bond": 1, "shape": -1}, "2025-04-09": {"spirit": 1, "body": 1, "vocation": -1, "bond": 1, "shape": -1}, "2025-04-10": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": -2}, "2025-04-11": {"spirit": 2, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-04-12": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2025-04-13": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-04-14": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": -1}, "2025-04-15": {"spirit": 0, "body": 1, "vocation": 1, "bond": 0, "shape": 0}, "2025-04-16": {"spirit": 0, "body": 0, "vocation": -1, "bond": 0, "shape": 0}, "2025-04-17": {"spirit": 1, "body": -1, "vocation": 1, "bond": 0, "shape": 0}, "2025-04-18": {"spirit": 1, "body": 0, "vocation": 2, "bond": 1, "shape": 0}, "2025-04-19": {"spirit": 1, "body": 1, "vocation": 0, "bond": 2, "shape": -1}, "2025-04-20": {"spirit": 1, "body": -1, "vocation": -1, "bond": 0, "shape": 0}, "2025-04-22": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-04-24": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-04-25": {"spirit": 0, "body": -1, "vocation": 0, "bond": 1, "shape": 0}, "2025-04-26": {"spirit": 1, "body": -1, "vocation": 1, "bond": 1, "shape": 0}, "2025-04-27": {"spirit": 1, "body": 1, "vocation": 0, "bond": 2, "shape": -1}, "2025-04-28": {"spirit": 1, "body": 0, "vocation": 1, "bond": -1, "shape": -1}, "2025-04-29": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": -1}, "2025-04-30": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-05-01": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-05-03": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": -1}, "2025-05-04": {"spirit": 0, "body": -1, "vocation": 1, "bond": 1, "shape": 0}, "2025-05-05": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-05-06": {"spirit": 0, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-05-07": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-05-08": {"spirit": 0, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-05-09": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-05-10": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2025-05-11": {"spirit": 0, "body": -1, "vocation": 0, "bond": 1, "shape": 0}, "2025-05-12": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-05-13": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-05-14": {"spirit": 0, "body": -1, "vocation": 1, "bond": -1, "shape": -1}, "2025-05-16": {"spirit": 0, "body": 0, "vocation": 0, "bond": 2, "shape": -1}, "2025-05-17": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-05-18": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-05-19": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-05-20": {"spirit": 1, "body": -1, "vocation": 0, "bond": 0, "shape": 0}, "2025-05-21": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-05-22": {"spirit": 1, "body": -1, "vocation": 0, "bond": 0, "shape": 0}, "2025-05-23": {"spirit": 1, "body": -1, "vocation": 1, "bond": 2, "shape": 0}, "2025-05-24": {"spirit": 0, "body": -1, "vocation": 0, "bond": 2, "shape": -1}, "2025-05-25": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-05-26": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-05-27": {"spirit": -1, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-05-28": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-05-29": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-05-30": {"spirit": 1, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2025-05-31": {"spirit": 1, "body": -1, "vocation": 1, "bond": 1, "shape": 0}, "2025-06-01": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-06-02": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": -2}, "2025-06-03": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": -1}, "2025-06-05": {"spirit": 1, "body": -2, "vocation": 1, "bond": 0, "shape": -1}, "2025-06-06": {"spirit": 1, "body": -1, "vocation": 1, "bond": 2, "shape": 0}, "2025-06-07": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 1}, "2025-06-08": {"spirit": 1, "body": -1, "vocation": 1, "bond": 1, "shape": 0}, "2025-06-09": {"spirit": 1, "body": -1, "vocation": 2, "bond": 1, "shape": -1}, "2025-06-10": {"spirit": 0, "body": -1, "vocation": 1, "bond": 1, "shape": 0}, "2025-06-11": {"spirit": 0, "body": -1, "vocation": 0, "bond": 1, "shape": 0}, "2025-06-12": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-06-13": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-06-14": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-06-15": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-06-16": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-06-17": {"spirit": 0, "body": -1, "vocation": 0, "bond": 0, "shape": 0}, "2025-06-19": {"spirit": 0, "body": -1, "vocation": 0, "bond": 1, "shape": -1}, "2025-06-20": {"spirit": 1, "body": -1, "vocation": 0, "bond": 2, "shape": 0}, "2025-06-21": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-06-22": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-06-23": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-06-25": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-06-26": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-06-27": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-06-29": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-06-30": {"spirit": 1, "body": -1, "vocation": 0, "bond": 1, "shape": -1}, "2025-07-01": {"spirit": 0, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-07-02": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-07-03": {"spirit": 1, "body": 0, "vocation": 0, "bond": -1, "shape": 0}, "2025-07-04": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-07-05": {"spirit": 2, "body": 1, "vocation": 1, "bond": 1, "shape": 2}, "2025-07-06": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-07-07": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-07-08": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-07-09": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": -1}, "2025-07-10": {"spirit": 1, "body": 0, "vocation": 0, "bond": -1, "shape": 0}, "2025-07-11": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2025-07-12": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": -1}, "2025-07-13": {"spirit": 2, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-07-15": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-07-16": {"spirit": 2, "body": 0, "vocation": 1, "bond": -1, "shape": 0}, "2025-07-17": {"spirit": 2, "body": -1, "vocation": 0, "bond": 1, "shape": -1}, "2025-07-18": {"spirit": 2, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-07-19": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-07-20": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": -1}, "2025-07-21": {"spirit": 1, "body": 0, "vocation": 1, "bond": -1, "shape": 0}, "2025-07-22": {"spirit": 1, "body": 1, "vocation": -1, "bond": 0, "shape": 0}, "2025-07-23": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-07-24": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-07-25": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-07-28": {"spirit": 1, "body": 0, "vocation": 0, "bond": -1, "shape": 0}, "2025-07-29": {"spirit": 2, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-07-30": {"spirit": 2, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-08-01": {"spirit": 2, "body": 1, "vocation": -1, "bond": 1, "shape": -1}, "2025-08-02": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-08-03": {"spirit": 2, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-08-04": {"spirit": 2, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-08-05": {"spirit": 2, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-08-06": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": -1}, "2025-08-07": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-08-08": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-08-09": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-08-10": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-08-12": {"spirit": 2, "body": 0, "vocation": 0, "bond": -1, "shape": 1}, "2025-08-13": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-08-16": {"spirit": 2, "body": -1, "vocation": 0, "bond": 2, "shape": 0}, "2025-08-17": {"spirit": 2, "body": 0, "vocation": 0, "bond": 2, "shape": -1}, "2025-08-18": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-08-20": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": 0}, "2025-08-22": {"spirit": 2, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-08-23": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-08-25": {"spirit": 2, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-08-26": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-08-27": {"spirit": 2, "body": 1, "vocation": 1, "bond": -1, "shape": 0}, "2025-08-28": {"spirit": 2, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-08-31": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-09-01": {"spirit": 1, "body": 2, "vocation": 0, "bond": 0, "shape": 0}, "2025-09-02": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": -1}, "2025-09-03": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": -1}, "2025-09-05": {"spirit": 2, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2025-09-06": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-09-07": {"spirit": 2, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-09-08": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-09-09": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": 0}, "2025-09-10": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-09-11": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-09-13": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": -1}, "2025-09-14": {"spirit": 2, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-09-15": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-09-16": {"spirit": 2, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-09-17": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-09-18": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-09-20": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-09-21": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-09-23": {"spirit": 2, "body": 0, "vocation": 0, "bond": 0, "shape": -1}, "2025-09-24": {"spirit": 2, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-09-26": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": -1}, "2025-09-27": {"spirit": 1, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-09-28": {"spirit": 2, "body": -1, "vocation": 0, "bond": 2, "shape": -1}, "2025-09-29": {"spirit": 2, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-09-30": {"spirit": 2, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-10-01": {"spirit": 2, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-10-02": {"spirit": 1, "body": -1, "vocation": 0, "bond": 0, "shape": -1}, "2025-10-03": {"spirit": 1, "body": 0, "vocation": 1, "bond": 2, "shape": -1}, "2025-10-04": {"spirit": 2, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-10-05": {"spirit": 2, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-10-06": {"spirit": 2, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-10-08": {"spirit": 2, "body": -1, "vocation": 1, "bond": 0, "shape": -1}, "2025-10-09": {"spirit": 2, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-10-10": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-10-11": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-10-12": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-10-13": {"spirit": 2, "body": -1, "vocation": 1, "bond": 0, "shape": 0}, "2025-10-14": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-10-15": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-10-16": {"spirit": 1, "body": -1, "vocation": 1, "bond": 0, "shape": 1}, "2025-10-17": {"spirit": 1, "body": 0, "vocation": 2, "bond": 1, "shape": 0}, "2025-10-19": {"spirit": 1, "body": 1, "vocation": 1, "bond": 1, "shape": 1}, "2025-10-23": {"spirit": 2, "body": 0, "vocation": 0, "bond": -1, "shape": 0}, "2025-10-26": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2025-10-27": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 1}, "2025-10-28": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-10-29": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-10-30": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-10-31": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-11-01": {"spirit": 0, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-11-03": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-11-04": {"spirit": 2, "body": 1, "vocation": -1, "bond": 0, "shape": 0}, "2025-11-05": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": -1}, "2025-11-06": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2025-11-07": {"spirit": 0, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2025-11-09": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-11-10": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2025-11-11": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": 0}, "2025-11-13": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2025-11-14": {"spirit": 0, "body": -1, "vocation": 0, "bond": 2, "shape": 0}, "2025-11-15": {"spirit": 0, "body": 0, "vocation": 0, "bond": 2, "shape": 1}, "2025-11-16": {"spirit": 0, "body": 1, "vocation": 0, "bond": 2, "shape": -1}, "2025-11-17": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2025-11-18": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-11-19": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-11-21": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-11-22": {"spirit": 0, "body": 0, "vocation": 1, "bond": 2, "shape": 1}, "2025-11-23": {"spirit": 1, "body": 1, "vocation": -1, "bond": 2, "shape": 1}, "2025-11-24": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-11-26": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-11-28": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2025-11-29": {"spirit": 0, "body": 1, "vocation": 0, "bond": 2, "shape": 0}, "2025-11-30": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2025-12-01": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-12-02": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2025-12-03": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-12-04": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-12-05": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 1}, "2025-12-06": {"spirit": 0, "body": 1, "vocation": 1, "bond": 2, "shape": 1}, "2025-12-07": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2025-12-08": {"spirit": 0, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2025-12-09": {"spirit": 0, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2025-12-10": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2025-12-12": {"spirit": 0, "body": 1, "vocation": 0, "bond": 2, "shape": 0}, "2025-12-13": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 1}, "2025-12-14": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2025-12-15": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2025-12-16": {"spirit": 1, "body": 2, "vocation": 0, "bond": 0, "shape": 0}, "2025-12-17": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": 0}, "2025-12-18": {"spirit": 1, "body": 1, "vocation": 1, "bond": -1, "shape": 0}, "2025-12-19": {"spirit": 0, "body": 2, "vocation": 0, "bond": 1, "shape": 0}, "2025-12-20": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2025-12-21": {"spirit": 0, "body": 2, "vocation": 0, "bond": 1, "shape": 1}, "2025-12-22": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2025-12-23": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2025-12-24": {"spirit": 0, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2025-12-25": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2025-12-26": {"spirit": 0, "body": 1, "vocation": 0, "bond": 2, "shape": 0}, "2025-12-27": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 1}, "2025-12-28": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2025-12-29": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2025-12-30": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": -1}, "2025-12-31": {"spirit": 0, "body": 1, "vocation": 1, "bond": 0, "shape": 0}, "2026-01-01": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 1}, "2026-01-02": {"spirit": 0, "body": 1, "vocation": 0, "bond": 2, "shape": 0}, "2026-01-03": {"spirit": 1, "body": 0, "vocation": 1, "bond": 2, "shape": 0}, "2026-01-04": {"spirit": 1, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2026-01-05": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 2}, "2026-01-06": {"spirit": 0, "body": -1, "vocation": 0, "bond": 1, "shape": 0}, "2026-01-07": {"spirit": 1, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2026-01-08": {"spirit": 2, "body": -1, "vocation": 0, "bond": 1, "shape": 0}, "2026-01-09": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2026-01-10": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 1}, "2026-01-11": {"spirit": 1, "body": 0, "vocation": 1, "bond": 2, "shape": 1}, "2026-01-12": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 1}, "2026-01-14": {"spirit": 0, "body": 0, "vocation": 1, "bond": -1, "shape": 1}, "2026-01-16": {"spirit": 0, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2026-01-17": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 1}, "2026-01-18": {"spirit": 1, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2026-01-19": {"spirit": 1, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2026-01-20": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2026-01-21": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 1}, "2026-01-22": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2026-01-23": {"spirit": 1, "body": 0, "vocation": 2, "bond": 2, "shape": 1}, "2026-01-24": {"spirit": 1, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2026-01-25": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 1}, "2026-01-26": {"spirit": 0, "body": 0, "vocation": 0, "bond": -1, "shape": 0}, "2026-01-28": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2026-01-29": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 1}, "2026-01-30": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 1}, "2026-01-31": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 1}, "2026-02-01": {"spirit": 1, "body": 0, "vocation": 1, "bond": 1, "shape": 0}, "2026-02-02": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 0}, "2026-02-03": {"spirit": 0, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2026-02-04": {"spirit": 2, "body": 1, "vocation": 1, "bond": -1, "shape": 0}, "2026-02-05": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 0}, "2026-02-06": {"spirit": 0, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2026-02-07": {"spirit": 1, "body": 0, "vocation": -1, "bond": 2, "shape": 0}, "2026-02-08": {"spirit": 0, "body": 0, "vocation": 0, "bond": 2, "shape": 0}, "2026-02-09": {"spirit": 0, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2026-02-10": {"spirit": 0, "body": 0, "vocation": 1, "bond": 1, "shape": 1}, "2026-02-11": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2026-02-12": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 1}, "2026-02-13": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2026-02-14": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 2}, "2026-02-15": {"spirit": 2, "body": 1, "vocation": -1, "bond": 1, "shape": 1}, "2026-02-16": {"spirit": 1, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2026-02-17": {"spirit": 1, "body": 0, "vocation": 1, "bond": 0, "shape": 0}, "2026-02-18": {"spirit": 1, "body": 0, "vocation": 1, "bond": -1, "shape": 0}, "2026-02-19": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 0}, "2026-02-20": {"spirit": 0, "body": 0, "vocation": 0, "bond": 1, "shape": 1}, "2026-02-21": {"spirit": 0, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2026-02-22": {"spirit": 1, "body": 1, "vocation": 0, "bond": 2, "shape": 0}, "2026-02-23": {"spirit": 0, "body": 0, "vocation": 0, "bond": 0, "shape": 1}, "2026-02-24": {"spirit": 1, "body": 2, "vocation": 1, "bond": 0, "shape": 0}, "2026-02-25": {"spirit": 0, "body": 1, "vocation": 0, "bond": 0, "shape": 1}, "2026-02-26": {"spirit": 1, "body": 0, "vocation": 0, "bond": 0, "shape": 0}, "2026-02-27": {"spirit": 1, "body": 1, "vocation": 1, "bond": 2, "shape": 0}, "2026-02-28": {"spirit": 1, "body": 0, "vocation": 0, "bond": 2, "shape": 1}, "2026-03-01": {"spirit": 1, "body": 0, "vocation": 0, "bond": 1, "shape": 0}, "2026-03-02": {"spirit": 1, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2026-03-03": {"spirit": 0, "body": 1, "vocation": 1, "bond": 1, "shape": 0}, "2026-03-04": {"spirit": 2, "body": 1, "vocation": 0, "bond": 1, "shape": 0}, "2026-03-05": {"spirit": 0, "body": 1, "vocation": 1, "bond": 0, "shape": 1}, "2026-03-06": {"spirit": 0, "body": 1, "vocation": 0, "bond": 2, "shape": 2}};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATS = [
  { id:"spirit",   label:"Spirit",   icon:"✦", desc:"Inner life, prayer, presence",                               color:"#F59E0B" },
  { id:"body",     label:"Body",     icon:"◈", desc:"Movement, exercise, physical care",                          color:"#10B981" },
  { id:"vocation", label:"Vocation", icon:"⬡", desc:"Work, craft, focus, contribution",                           color:"#3B82F6" },
  { id:"bond",     label:"Bond",     icon:"◇", desc:"Connection, attentiveness, your closest person",             color:"#EC4899" },
  { id:"shape",    label:"Shape",    icon:"◬", desc:"Art, learning, hobbies — the form you're becoming",          color:"#8B5CF6" },
];
const SCORES = [-2,-1,0,1,2];
const S_SHORT = {"-2":"−2","-1":"−1","0":"0","1":"+1","2":"+2"};
const S_LABEL = {"-2":"Neglected","-1":"Below par","0":"Neutral","1":"Good","2":"Flourished"};

// ─── PASSPHRASE ───────────────────────────────────────────────────────────────
const ADJS  = ["amber","silver","cedar","golden","ivory","linen","mossy","ochre","russet","sage","tawny","umber","ashen","birch","dusky","flint","hazel","laurel","muted","quiet"];
const NOUNS = ["river","candle","lantern","journal","ember","hearth","hollow","meadow","pillar","quill","stone","timber","vessel","garden","anchor","mantle","ledger","chapel","loft","grove"];
const VERBS = ["holds","reads","tends","keeps","marks","turns","bears","draws","finds","rests","seeks","walks","knows","lights","grows","waits","hears","mends","opens","stays"];
const genPP = () => { const p=a=>a[Math.floor(Math.random()*a.length)]; return `${p(ADJS)}-${p(NOUNS)}-${p(VERBS)}`; };

// ─── DATE UTILS ───────────────────────────────────────────────────────────────
const todayStr  = () => new Date().toISOString().split("T")[0];
const getDIM    = (y,m) => new Date(y,m+1,0).getDate();
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONFULL= ["January","February","March","April","May","June","July","August","September","October","November","December"];

function weekDates(date){
  const d=new Date(date), day=d.getDay();
  const mon=new Date(d.setDate(d.getDate()-day+(day===0?-6:1)));
  return Array.from({length:7},(_,i)=>{ const nd=new Date(mon); nd.setDate(mon.getDate()+i); return nd.toISOString().split("T")[0]; });
}

// ─── HAPTICS ─────────────────────────────────────────────────────────────────
const haptic = t => { try{ if(!navigator.vibrate)return; t==="save"?navigator.vibrate([12,50,18]):t==="nav"?navigator.vibrate(5):navigator.vibrate(8); }catch{} };

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const loadData = async pp => { try{ const r=await window.storage.get(`hab_${pp}`,true); return r?JSON.parse(r.value):{}; }catch{ return {}; } };
const saveData = async (pp,data) => { try{ await window.storage.set(`hab_${pp}`,JSON.stringify(data),true); }catch{} };

// ─── SCORE UTILS ─────────────────────────────────────────────────────────────
const scoreColor = n => { const v=parseFloat(n); if(v>=1.5)return GREEN; if(v>=0.5)return "#2D6A4F"; if(v>-0.5)return "#888"; if(v>-1.5)return "#666"; return "#999"; };
const scoreLabel = v => { if(v>=1.5)return"Flourishing"; if(v>=0.5)return"Good"; if(v>=-0.5)return"Neutral"; if(v>=-1.5)return"Struggling"; return"Neglected"; };

// ─── CLOSING QUOTES ──────────────────────────────────────────────────────────
const CLOSE_QUOTES = [
  // Scripture
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
  { text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
  { text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.", ref: "Ephesians 2:10" },
  { text: "Do you not know that your bodies are temples of the Holy Spirit? Therefore honor God with your bodies.", ref: "1 Corinthians 6:19–20" },
  { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref: "Galatians 6:9" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { text: "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus.", ref: "Colossians 3:17" },
  { text: "For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you.", ref: "Jeremiah 29:11" },
  { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", ref: "Isaiah 40:31" },
  { text: "Be transformed by the renewing of your mind.", ref: "Romans 12:2" },
  { text: "Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength.", ref: "Mark 12:30" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.", ref: "Psalm 51:10" },
  { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4" },
  { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2" },
  { text: "Finally, brothers and sisters, whatever is true, whatever is noble — think about such things.", ref: "Philippians 4:8" },
  { text: "Two are better than one, because they have a good return for their labor.", ref: "Ecclesiastes 4:9" },
  { text: "Above all else, guard your heart, for everything you do flows from it.", ref: "Proverbs 4:23" },
  { text: "He has shown you what is good: to act justly, love mercy, and walk humbly with your God.", ref: "Micah 6:8" },
  // Aspirational
  { text: "Small steps taken consistently will always outrun giant leaps taken occasionally.", ref: null },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", ref: "James Clear" },
  { text: "The unexamined life is not worth living.", ref: "Socrates" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", ref: "Aristotle" },
  { text: "Whoever you are, be a good one.", ref: "Abraham Lincoln" },
  { text: "The quality of your life is determined by the quality of your questions.", ref: null },
  { text: "What got you here won't get you there.", ref: "Marshall Goldsmith" },
  { text: "You can't go back and change the beginning, but you can start where you are and change the ending.", ref: "C.S. Lewis" },
  { text: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.", ref: "Ernest Hemingway" },
  { text: "The journey of a thousand miles begins with a single step.", ref: "Lao Tzu" },
  { text: "In the middle of every difficulty lies opportunity.", ref: "Albert Einstein" },
  { text: "Your life is the sum of a remainder of an unbalanced equation inherent to the programming of the universe.", ref: null },
  { text: "Knowing yourself is the beginning of all wisdom.", ref: "Aristotle" },
  { text: "The only person you are destined to become is the person you decide to be.", ref: "Ralph Waldo Emerson" },
  { text: "Do not watch the clock. Do what it does — keep going.", ref: "Sam Levenson" },
  { text: "Act as if what you do makes a difference. It does.", ref: "William James" },
  { text: "If you want to lift yourself up, lift up someone else.", ref: "Booker T. Washington" },
  { text: "The secret of getting ahead is getting started.", ref: "Mark Twain" },
  { text: "It always seems impossible until it's done.", ref: "Nelson Mandela" },
  { text: "A man who dares to waste one hour of time has not discovered the value of life.", ref: "Charles Darwin" },
  { text: "Life isn't about finding yourself. Life is about creating yourself.", ref: "George Bernard Shaw" },
  { text: "You must be the change you wish to see in the world.", ref: "Gandhi" },
  { text: "The man who moves a mountain begins by carrying away small stones.", ref: "Confucius" },
  { text: "In character, in manner, in style — in all things the supreme excellence is simplicity.", ref: "Longfellow" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", ref: "Emerson" },
  { text: "The cave you fear to enter holds the treasure you seek.", ref: "Joseph Campbell" },
  { text: "Do what you can, with what you have, where you are.", ref: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", ref: "Chinese Proverb" },
  { text: "Difficult roads often lead to beautiful destinations.", ref: null },
  { text: "Strength does not come from what you can do. It comes from overcoming the things you thought you couldn't.", ref: null },
  { text: "Be patient with yourself. Self-growth is tender; it's holy ground.", ref: "Stephen Covey" },
  { text: "You will never always be motivated. You have to learn to be disciplined.", ref: null },
  { text: "Don't count the days. Make the days count.", ref: "Muhammad Ali" },
  { text: "Whoever is careless with the truth in small matters cannot be trusted with important matters.", ref: "Einstein" },
  { text: "Character is the ability to carry out a good resolution long after the excitement of the moment has passed.", ref: "Cavett Robert" },
  { text: "The will to win, the desire to succeed — the urge to reach your full potential — these are the keys.", ref: "Confucius" },
  { text: "One day or day one. You decide.", ref: null },
  { text: "Growth is never by mere chance; it is the result of forces working together.", ref: "James Cash Penney" },
  { text: "Perseverance is not a long race; it is many short races one after the other.", ref: "Walter Elliot" },
  { text: "The mind is not a vessel to be filled but a fire to be kindled.", ref: "Plutarch" },
  { text: "Start where you are. Use what you have. Do what you can.", ref: "Arthur Ashe" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", ref: null },
  { text: "You are never too old to set another goal or to dream a new dream.", ref: "C.S. Lewis" },
  { text: "The only way to do great work is to love what you do.", ref: "Steve Jobs" },
  { text: "Seasons change, and so can we.", ref: null },
];
const getQuote = dateStr => CLOSE_QUOTES[new Date(dateStr).getDate() % CLOSE_QUOTES.length];

// ─── BUTTON ──────────────────────────────────────────────────────────────────
function Btn({children,onClick,variant="primary",disabled,full,style:sx}){
  const base={border:"none",borderRadius:10,padding:"13px 24px",fontSize:13,fontWeight:600,
    cursor:disabled?"not-allowed":"pointer",fontFamily:FF,transition:"background 0.3s, opacity 0.15s",
    WebkitTapHighlightColor:"transparent",touchAction:"manipulation",
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
    width:full?"100%":undefined,boxSizing:"border-box"};
  if(variant==="ghost") return <button onClick={!disabled?onClick:undefined} style={{...base,background:"transparent",color:"#333",border:"1.5px solid #E0E0E0",...sx}}>{children}</button>;
  return <button onClick={!disabled?onClick:undefined} style={{...base,background:GREEN,color:"#fff",...sx}}>{children}</button>;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,  setScreen]  = useState("loading");
  const [pp,      setPP]      = useState("");
  const [ppInput, setPPI]     = useState("");
  const [newPP,   setNewPP]   = useState("");
  const [ppErr,   setPPErr]   = useState("");
  const [entries, setEntries] = useState({});
  const [view,    setView]    = useState("today");
  const [date,    setDate]    = useState(todayStr());
  const [drafts,  setDrafts]  = useState({});
  const [saved,   setSaved]   = useState(false);
  const [isDemo,     setIsDemo]     = useState(false);
  const [reminderOn, setReminderOn]  = useState(false);
  const [reminderTime, setReminderTime] = useState("21:00");
  const [notifPerm,  setNotifPerm]   = useState("default");
  const timer = useRef(null);

  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get("hab_pp");
        if(r){ setPP(r.value); setEntries(await loadData(r.value)); setScreen("main"); }
        else setScreen("splash");
      }catch{ setScreen("splash"); }
    })();
  },[]);

  useEffect(()=>{ setDrafts(entries[date]?{...entries[date]}:{}); setSaved(false); },[date,entries]);

  // ── Reminder boot ──
  useEffect(()=>{
    const stored = localStorage.getItem("hab_reminder");
    if(stored){
      const {on,time} = JSON.parse(stored);
      setReminderOn(on); setReminderTime(time||"21:00");
    }
    if("Notification" in window) setNotifPerm(Notification.permission);
  },[]);

  // ── Reminder check: fire if time has passed today and not yet fired ──
  useEffect(()=>{
    if(!reminderOn) return;
    const check = ()=>{
      const now = new Date();
      const [h,m] = reminderTime.split(":").map(Number);
      const fireTime = new Date(); fireTime.setHours(h,m,0,0);
      const todayKey = "hab_notif_"+now.toISOString().split("T")[0];
      const alreadyFired = localStorage.getItem(todayKey);
      if(!alreadyFired && now >= fireTime && Notification.permission==="granted"){
        new Notification("hab·i·tūdes", {
          body: "Time to record today. How did each area of your life go?",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "habitudes-daily",
        });
        localStorage.setItem(todayKey,"1");
      }
    };
    check();
    const interval = setInterval(check, 60000);
    return ()=>clearInterval(interval);
  },[reminderOn, reminderTime]);

  const saveReminder = async (on, time) => {
    if(on && Notification.permission !== "granted"){
      const result = await Notification.requestPermission();
      setNotifPerm(result);
      if(result !== "granted"){ return; }
    }
    setReminderOn(on); setReminderTime(time);
    localStorage.setItem("hab_reminder", JSON.stringify({on,time}));
  };

  const persist = useCallback((p,data)=>{ clearTimeout(timer.current); timer.current=setTimeout(()=>saveData(p,data),800); },[]);

  const setScore=(id,s)=>{ haptic("tap"); setDrafts(d=>({...d,[id]:s})); setSaved(false); };

  const saveEntry=()=>{
    if(!CATS.every(c=>drafts[c.id]!==undefined))return;
    haptic("save");
    const next={...entries,[date]:{...drafts}};
    setEntries(next); persist(pp,next); setSaved(true);
    track("day_recorded");
  };

  const startDemo=()=>{
    setIsDemo(true); setPP("demo-account"); setEntries(DEMO_ENTRIES);
    setDate("2026-02-15"); setView("year"); setScreen("main");
  };

  const startNew=()=>{ setNewPP(genPP()); setScreen("onboard"); };

  const track = (name) => { try{ window.va&&window.va("event",{name}); }catch{} };

  const confirmNew=async()=>{
    await window.storage.set("hab_pp",newPP);
    setPP(newPP); setEntries({}); setIsDemo(false); setScreen("main");
    track("journal_created");
  };

  const signIn=async()=>{
    const p=ppInput.trim().toLowerCase();
    if(!p.match(/^[a-z]+-[a-z]+-[a-z]+$/)){ setPPErr("Format: word-word-word"); return; }
    await window.storage.set("hab_pp",p);
    setPP(p); setEntries(await loadData(p)); setIsDemo(false); setScreen("main");
    track("journal_opened");
  };

  const signOut=async()=>{
    try{ await window.storage.delete("hab_pp"); }catch{}
    setScreen("splash"); setPP(""); setPPI(""); setPPErr(""); setIsDemo(false);
  };

  // ── Chart builders ──
  const weekData=()=>weekDates(date).map((d,i)=>{ const e=entries[d]||{},row={day:DAYS[i],date:d}; CATS.forEach(c=>{row[c.label]=e[c.id]??null;}); return row; });
  const monthData=()=>{ const d=new Date(date),y=d.getFullYear(),m=d.getMonth(); return Array.from({length:getDIM(y,m)},(_,i)=>{ const key=`${y}-${String(m+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`; const e=entries[key]||{},row={day:i+1,date:key}; CATS.forEach(c=>{row[c.label]=e[c.id]??null;}); return row; }); };
  const yearData=()=>MONS.map((mon,mi)=>{ const y=new Date(date).getFullYear(),row={month:mon}; CATS.forEach(c=>{ const vals=[]; for(let d=1;d<=getDIM(y,mi);d++){ const key=`${y}-${String(mi+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; if(entries[key]?.[c.id]!==undefined)vals.push(entries[key][c.id]); } row[c.label]=vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2):null; }); return row; });
  const radarData=dates=>CATS.map(c=>{ const vals=dates.map(d=>entries[d]?.[c.id]).filter(v=>v!==undefined); return{category:c.label,score:vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2):0,fullMark:2}; });

  const allScored = CATS.every(c=>drafts[c.id]!==undefined);
  const doneCount = CATS.filter(c=>drafts[c.id]!==undefined).length;
  const curY = new Date(date).getFullYear();
  const curM = new Date(date).getMonth();
  const mw   = {maxWidth:520,margin:"0 auto",padding:"0 20px"};

  // ── LOADING ──
  if(screen==="loading") return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FF}}>
      <div style={{color:"#AAA",fontSize:13}}>Loading…</div>
    </div>
  );

  // ── SPLASH ──
  if(screen==="splash") return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:FF,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <img src={LOGO} alt="Habitudes" style={{height:54,width:"auto",marginBottom:28}} />
      <p style={{color:"#666",fontSize:15,maxWidth:280,lineHeight:1.7,marginBottom:48,textAlign:"center",margin:"0 0 48px"}}>
        A 60-second evening ritual.<br/>Score five dimensions of your life.<br/>Watch your shape emerge.
      </p>

      <div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:10}}>
        <Btn onClick={startNew} full>Create my journal</Btn>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0"}}>
          <div style={{flex:1,height:1,background:"#EEE"}}/>
          <span style={{color:"#AAA",fontSize:12}}>or sign in</span>
          <div style={{flex:1,height:1,background:"#EEE"}}/>
        </div>

        <input placeholder="your-passphrase-here" value={ppInput}
          onChange={e=>{setPPI(e.target.value);setPPErr("");}}
          onKeyDown={e=>e.key==="Enter"&&signIn()}
          style={{width:"100%",boxSizing:"border-box",background:"#F7F7F7",border:`1.5px solid ${ppErr?"#CC0000":"#E8E8E8"}`,borderRadius:10,color:"#000",padding:"12px 14px",fontSize:14,fontFamily:"monospace",outline:"none"}}/>
        {ppErr&&<div style={{color:"#CC0000",fontSize:12}}>{ppErr}</div>}
        <Btn onClick={signIn} variant="ghost" full>Open existing journal</Btn>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0"}}>
          <div style={{flex:1,height:1,background:"#EEE"}}/>
          <span style={{color:"#AAA",fontSize:12}}>or explore</span>
          <div style={{flex:1,height:1,background:"#EEE"}}/>
        </div>

        <div style={{display:"flex",gap:8}}>
          <button onClick={startDemo} style={{flex:1,background:"none",border:"1.5px solid #E8E8E8",borderRadius:10,padding:"12px",fontSize:12,fontWeight:600,letterSpacing:0.5,color:"#555",cursor:"pointer",fontFamily:FF,display:"flex",alignItems:"center",justifyContent:"center"}}>
            DEMO
          </button>
          <button onClick={()=>setScreen("about")} style={{flex:1,background:"none",border:"1.5px solid #E8E8E8",borderRadius:10,padding:"12px",fontSize:12,fontWeight:600,letterSpacing:0.5,color:"#555",cursor:"pointer",fontFamily:FF,display:"flex",alignItems:"center",justifyContent:"center"}}>
            ABOUT
          </button>
        </div>
      </div>

      <div style={{marginTop:48,display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
        {["No email required","Completely private","Your key, your data"].map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:6,color:"#AAA",fontSize:12}}>
            <span style={{color:GREEN,fontWeight:700}}>✓</span> {t}
          </div>
        ))}
      </div>
    </div>
  );

  // ── ABOUT ──
  if(screen==="about") return <AboutView onBack={()=>setScreen("splash")} onStart={startNew} />;
  if(screen==="onboard") return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:FF,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{marginBottom:32,textAlign:"center"}}>
          <img src={LOGO} alt="Habitudes" style={{height:38,width:"auto",margin:"0 auto 20px",display:"block"}}/>
          <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:700,color:"#000",letterSpacing:-0.5}}>Your journal key</h2>
          <p style={{margin:0,color:"#777",fontSize:14,lineHeight:1.6}}>This passphrase is your anonymous account.<br/>Write it down — it can't be recovered.</p>
        </div>

        <div style={{background:"#F7F7F7",border:"2px dashed #D8D8D8",borderRadius:12,padding:"28px 24px",textAlign:"center",marginBottom:16}}>
          <div style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:"#000",letterSpacing:1,marginBottom:10}}>{newPP}</div>
          <button onClick={()=>setNewPP(genPP())} style={{background:"none",border:"none",color:"#888",fontSize:12,cursor:"pointer",fontFamily:FF,textDecoration:"underline"}}>
            Generate different words
          </button>
        </div>

        <div style={{background:"#FFFBEB",border:"1.5px solid #FCD34D",borderRadius:10,padding:"14px 16px",marginBottom:24,display:"flex",gap:10}}>
          <div style={{fontSize:16,flexShrink:0}}>⚠️</div>
          <div style={{fontSize:13,color:"#92400E",lineHeight:1.55}}>Write this down before continuing. Anyone with these three words can access your journal.</div>
        </div>

        <Btn onClick={confirmNew} full style={{marginBottom:10}}>I've saved it — let's begin</Btn>
        <Btn onClick={()=>setScreen("splash")} variant="ghost" full>← Back</Btn>
      </div>
    </div>
  );

  // ── MAIN ──
  return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:FF,color:"#000",paddingBottom:80}}>

      {/* Demo banner */}
      {isDemo&&(
        <div style={{background:GREEN,color:"#fff",textAlign:"center",padding:"8px 16px",fontSize:12,fontWeight:500}}>
          👀 You're viewing a demo journal —&nbsp;
          <button onClick={startNew} style={{background:"none",border:"none",color:"#A8D5C2",fontSize:12,cursor:"pointer",textDecoration:"underline",fontFamily:FF}}>
            create your own
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #EEE",position:"sticky",top:0,zIndex:10}}>
        <div style={{...mw,display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
          <img src={LOGO} alt="Habitudes" style={{height:26,width:"auto"}}/>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {!isDemo&&<span style={{fontSize:11,color:"#CCC",fontFamily:"monospace"}}>{pp}</span>}
            <button onClick={signOut} style={{background:"none",border:"none",color:"#AAA",fontSize:12,cursor:"pointer",fontFamily:FF}}>
              {isDemo?"Exit demo":"Sign out"}
            </button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:"#fff",borderBottom:"1px solid #EEE"}}>
        <div style={{...mw,display:"flex"}}>
          {[["about","ABOUT"],["today","TODAY"],["week","WEEK"],["month","MONTH"],["year","YEAR"]].map(([v,l])=>(
            <button key={v} onClick={()=>{ haptic("nav"); setView(v); }} style={{
              flex:1,background:"none",border:"none",
              borderBottom:view===v?`2px solid ${GREEN}`:"2px solid transparent",
              color:view===v?GREEN:"#AAA",
              padding:"12px 0 10px",cursor:"pointer",
              fontSize:13,fontWeight:view===v?600:400,
              fontFamily:FF,transition:"all 0.15s",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={mw}>

        {/* ── TODAY ── */}
        {view==="today"&&(
          <div style={{paddingTop:28}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <div style={{fontSize:24,fontWeight:700,color:"#000",letterSpacing:-0.5}}>
                  {new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long"})}
                </div>
                <div style={{fontSize:13,color:"#777",marginTop:2}}>
                  {new Date(date+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
                </div>
              </div>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                style={{background:"#F7F7F7",border:"1.5px solid #E8E8E8",color:"#333",padding:"8px 10px",borderRadius:8,fontSize:12,fontFamily:FF,cursor:"pointer",outline:"none"}}/>
            </div>

            {/* Progress */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{flex:1,height:3,background:"#EEE",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(doneCount/5)*100}%`,background:GREEN,borderRadius:3,transition:"width 0.3s ease"}}/>
              </div>
              <span style={{fontSize:12,color:"#AAA",flexShrink:0,minWidth:54}}>
                {doneCount===5?"Complete ✓":`${doneCount} / 5`}
              </span>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8,paddingBottom:24}}>
              {CATS.map(cat=><ScoreRow key={cat.id} cat={cat} score={drafts[cat.id]} onScore={setScore} readonly={isDemo}/>)}
            </div>

            {!isDemo&&(
              <>
                {/* Week strip — shows Mon–Sun of the currently selected date's week */}
                <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:24,marginBottom:8}}>
                  {weekDates(date).map((d,i)=>{
                    const checked=!!entries[d];
                    const isToday=d===todayStr();
                    return <div key={d} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{
                        width:30,height:30,borderRadius:"50%",
                        border:`2px solid ${checked?"#1a6b3c":isToday?"#999":"#ccc"}`,
                        background:checked?"#e8f5ee":"#fff",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:14,color:checked?"#1a6b3c":"#bbb",fontWeight:700,
                      }}>
                        {checked?"✓":""}
                      </div>
                      <span style={{fontSize:10,color:isToday?"#555":"#AAA",fontWeight:isToday?600:400}}>{DAYS[i]}</span>
                    </div>;
                  })}
                </div>
                <div style={{marginTop:8}}>
                  <Btn onClick={saveEntry} disabled={!allScored&&!saved} full
                    style={{padding:"15px",fontSize:14,
                      background:saved?"#1a6b3c":"#111",
                      color:"#fff",
                      transition:"background 0.3s, opacity 0.15s",
                      opacity: (!allScored&&!saved) ? 0.4 : 1,
                      cursor: (!allScored&&!saved) ? "not-allowed" : "pointer",
                    }}>
                    {saved?"✔  Completed":"Record this day"}
                  </Btn>
                </div>
                {saved&&(()=>{ const q=getQuote(date); return(
                  <div style={{marginTop:16,marginBottom:4,padding:"16px 20px",background:"#f0f8f4",borderRadius:12,textAlign:"center"}}>
                    <div style={{fontSize:13,color:"#2d6a4f",fontStyle:"italic",lineHeight:1.7}}>"{q.text}"</div>
                    {q.ref&&<div style={{fontSize:11,color:"#5a9a78",marginTop:8,fontWeight:500}}>— {q.ref}</div>}
                  </div>
                );})()}
              </>
            )}

          {/* Score guide */}
            <div style={{marginTop:32,background:"#F7F7F7",borderRadius:12,padding:"18px 20px"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#AAA",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Score Guide</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 20px"}}>
                {SCORES.map(s=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:30,height:30,borderRadius:8,background:GREEN,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{S_SHORT[s]}</div>
                    <span style={{color:"#444",fontSize:13}}>{S_LABEL[s]}</span>
                  </div>
                ))}
              </div>
            </div>

            {!isDemo&&(
              <ReminderCard
                on={reminderOn} time={reminderTime} perm={notifPerm}
                onChange={saveReminder}
              />
            )}

            <div style={{marginTop:10,background:"#F7F7F7",borderRadius:12,padding:"14px 18px",display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{fontSize:18,flexShrink:0}}>📱</div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#000",marginBottom:3}}>Add to Home Screen</div>
                <div style={{fontSize:12,color:"#777",lineHeight:1.55}}>Safari → Share → "Add to Home Screen." Enables daily reminders.</div>
              </div>
            </div>
          </div>
        )}

        {view==="week"&&(
          <ChartView
            title={`Week of ${MONFULL[new Date(date+"T12:00:00").getMonth()]} ${new Date(date+"T12:00:00").getDate()}`}
            subtitle="7-day balance"
            lineData={weekData()} xKey="day"
            radarData={radarData(weekDates(date))}
          />
        )}

        {view==="month"&&(
          <ChartView
            title={`${MONFULL[curM]} ${curY}`}
            subtitle="Monthly arc"
            lineData={monthData()} xKey="day"
            radarData={radarData(monthData().map(d=>d.date))}
          />
        )}

        {view==="year"&&(
          <ChartView
            title={String(curY)}
            subtitle="Full year by month"
            lineData={yearData()} xKey="month"
            radarData={radarData(Object.keys(entries).filter(d=>d.startsWith(curY)))}
          />
        )}

        {view==="about"&&(
          <AboutView embedded />
        )}
      </div>
    </div>
  );
}

// ─── ABOUT VIEW ──────────────────────────────────────────────────────────────
const FAQ_SECTIONS = [
  {
    title: "Privacy & Data Security",
    items: [
      { q: "Is my data safe?", a: "There's nothing to protect, honestly. The app never asks for your name, email, or anything about you. You get three random words as your key — that's it. Your entries live on your device. Nobody can see them." },
      { q: "How do I know you're not tracking me?", a: "The app has no backend, no database, no server that stores anything about you. It's a static web app — like a document that runs in your browser. Your journal lives in your phone's local storage, tied to your passphrase. There's nowhere for data to go." },
      { q: "What if someone finds my phone?", a: "Your entries are stored under your passphrase key. If they don't know your three words, they can't access anything. Lock your phone like you normally would." },
      { q: "What happens if I lose my three words?", a: "The journal is gone — there's no recovery. That's a feature, not a bug. It means there's no back door, no \"forgot my password\" flow. You are the only key." },
      { q: "Do you use any analytics?", a: "Vercel (the hosting platform) counts total page visits — just a number, like a hit counter. No personal data, no behavior tracking, no cookies." },
    ]
  },
  {
    title: "How It Works",
    items: [
      { q: "What are the five dimensions?", a: null, list: [
        { label: "Spirit", desc: "Are you growing in your faith journey? Your inner life, sense of meaning, and connection to God.", color: "#F59E0B", icon: "✦" },
        { label: "Body", desc: "Are you taking care of the vessel? Physical health, sleep, energy, and movement.", color: "#10B981", icon: "◈" },
        { label: "Vocation", desc: "Are you showing up with purpose? Your work, contribution, and sense of calling.", color: "#3B82F6", icon: "⬡" },
        { label: "Bond", desc: "Are you present in your closest relationship? Your partner, family, and deepest connection.", color: "#EC4899", icon: "◇" },
        { label: "Shape", desc: "Are you becoming who you want to be? Character, growth, and the direction of your life.", color: "#8B5CF6", icon: "◬" },
      ]},
      { q: "What do the scores mean?", a: null, scores: true },
      { q: "What is the 'balance shape'?", a: "Your scores over time form a pentagon on the radar chart. A regular pentagon — five equal sides — represents harmony across all dimensions. Most people's shapes are lopsided in interesting ways. That's the insight." },
    ]
  },
  {
    title: "Getting Started",
    items: [
      { q: "How do I start?", a: "Go to habitudes.app. Tap 'Create my journal.' You'll receive three random words — write them down somewhere safe. That's your key. Then score your day." },
      { q: "Can I add it to my home screen?", a: "Yes. On iPhone, open habitudes.app in Safari, tap the Share button, then 'Add to Home Screen.' It'll behave like a native app — no browser bar, full screen." },
      { q: "Is there a daily reminder?", a: "Yes. In the Today tab, there's a reminder toggle. Set your preferred time and allow notifications when prompted." },
    ]
  },
  {
    title: "Technical",
    items: [
      { q: "What's the architecture? (for tech folks)", a: "Pure client-side React app hosted on Vercel's CDN. No API calls, no database, no authentication. localStorage keyed to a passphrase hash. Vercel analytics sees traffic counts only — no personal data." },
      { q: "Does it work offline?", a: "Mostly. Once loaded, the app works without a connection. New entries save locally. You'll need a connection to first load the app." },
      { q: "Is there an iOS or Android app?", a: "Not yet. The web app installed to your home screen behaves like a native app. A proper App Store version may come later." },
    ]
  },
];

function AboutView({ embedded, onBack, onStart }) {
  const [open, setOpen] = useState({});
  const toggle = key => setOpen(o => ({...o, [key]: !o[key]}));

  return (
    <div style={{
      paddingTop: embedded ? 28 : 0,
      paddingBottom: embedded ? 40 : 0,
      minHeight: embedded ? undefined : "100vh",
      background: "#fff",
      fontFamily: FF,
    }}>
      {/* Back button (splash mode only) */}
      {!embedded && (
        <div style={{padding:"16px 24px 0"}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#AAA",fontSize:13,cursor:"pointer",fontFamily:FF,display:"flex",alignItems:"center",gap:6}}>
            ← Back
          </button>
        </div>
      )}

      {/* Logo (splash mode only) */}
      {!embedded && (
        <div style={{padding:"24px 24px 0",textAlign:"center"}}>
          <img src={LOGO} alt="Habitudes" style={{height:40,width:"auto",marginBottom:20}} />
        </div>
      )}

      <div style={{maxWidth:520,margin:"0 auto",padding:"0 20px"}}>

        {/* Purpose statement */}
        <div style={{marginBottom:36}}>
          <div style={{fontSize:embedded?20:18,fontWeight:700,color:"#000",letterSpacing:-0.3,marginBottom:16}}>
            Why I built this
          </div>
          {[
            "Time moves fast. Years have a way of slipping by before we notice that something important quietly stopped getting our attention — a relationship, our health, our faith, our sense of purpose.",
            "I built Habitudes because I wanted a simple, honest way to ask myself each evening: how did I actually show up today? Not a productivity tracker or a goal system — just five quiet questions about the five things that matter most to me.",
            "Over time, the scores draw a shape. That shape reveals something a journal entry can't — the pattern. Where you're flourishing. Where you're drifting. The small, consistent choices that become who you are.",
            "This is a tool for anyone who believes that growth is intentional, that becoming takes attention, and that the examined life — even in sixty seconds — is worth living.",
          ].map((para, i) => (
            <p key={i} style={{fontSize:14,color:"#444",lineHeight:1.75,margin:"0 0 14px",fontStyle: i===3 ? "italic" : "normal"}}>
              {para}
            </p>
          ))}
          <p style={{fontSize:13,color:"#AAA",margin:"16px 0 0"}}>— David Bishop</p>
        </div>

        {/* Divider */}
        <div style={{height:1,background:"#EEE",marginBottom:32}} />

        {/* FAQ accordion */}
        {FAQ_SECTIONS.map((section, si) => (
          <div key={si} style={{marginBottom:28}}>
            <div style={{fontSize:11,fontWeight:700,color:GREEN,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>
              {section.title}
            </div>
            {section.items.map((item, ii) => {
              const key = `${si}-${ii}`;
              const isOpen = open[key];
              return (
                <div key={ii} style={{borderBottom:"1px solid #F0F0F0"}}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width:"100%", background:"none", border:"none", padding:"13px 0",
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      cursor:"pointer", fontFamily:FF, textAlign:"left",
                      WebkitTapHighlightColor:"transparent",
                    }}
                  >
                    <span style={{fontSize:13,fontWeight:600,color:"#000",paddingRight:16,lineHeight:1.4}}>
                      {item.q}
                    </span>
                    <span style={{
                      fontSize:16,color:"#AAA",flexShrink:0,
                      transform:isOpen?"rotate(90deg)":"rotate(0deg)",
                      transition:"transform 0.2s",display:"block",lineHeight:1,
                    }}>›</span>
                  </button>
                  {isOpen && (
                    <div style={{paddingBottom:16}}>
                      {item.a && (
                        <p style={{fontSize:13,color:"#555",lineHeight:1.7,margin:0}}>{item.a}</p>
                      )}
                      {item.list && (
                        <div style={{display:"flex",flexDirection:"column",gap:10}}>
                          {item.list.map(cat => (
                            <div key={cat.label} style={{display:"flex",alignItems:"flex-start",gap:12}}>
                              <div style={{
                                width:28,height:28,borderRadius:8,background:cat.color+"18",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:12,color:cat.color,flexShrink:0,marginTop:1,
                              }}>{cat.icon}</div>
                              <div>
                                <div style={{fontSize:13,fontWeight:600,color:"#000",marginBottom:2}}>{cat.label}</div>
                                <div style={{fontSize:12,color:"#666",lineHeight:1.5}}>{cat.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.scores && (
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px"}}>
                          {SCORES.map(s => (
                            <div key={s} style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{
                                width:30,height:30,borderRadius:8,background:GREEN,
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:11,fontWeight:700,color:"#fff",flexShrink:0,
                              }}>{S_SHORT[s]}</div>
                              <span style={{color:"#555",fontSize:13}}>{S_LABEL[s]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Footer CTA — splash mode only */}
        {!embedded && (
          <div style={{marginTop:32,paddingTop:24,borderTop:"1px solid #EEE",textAlign:"center"}}>
            <button
              onClick={onStart}
              style={{
                background:GREEN,color:"#fff",border:"none",borderRadius:10,
                padding:"14px 32px",fontSize:14,fontWeight:600,cursor:"pointer",
                fontFamily:FF,WebkitTapHighlightColor:"transparent",
              }}
            >
              Create my journal
            </button>
            <p style={{fontSize:12,color:"#AAA",marginTop:12}}>Free, private, no signup.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REMINDER CARD ───────────────────────────────────────────────────────────
function ReminderCard({on, time, perm, onChange}){
  const [localTime, setLocalTime] = useState(time);
  const blocked = perm === "denied";

  return(
    <div style={{marginTop:10,background:"#F7F7F7",borderRadius:12,padding:"16px 18px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom: on ? 12 : 0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:17}}>🔔</span>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:"#000"}}>Daily reminder</div>
            {blocked
              ? <div style={{fontSize:11,color:"#CC4400",marginTop:2}}>Notifications blocked — enable in browser settings</div>
              : <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{on ? `Remind me at ${time}` : "Off"}</div>
            }
          </div>
        </div>
        {/* Toggle */}
        <button
          onClick={()=>!blocked&&onChange(!on, localTime)}
          style={{
            width:44, height:26, borderRadius:13,
            background: on ? "#0B2B1F" : "#DDD",
            border:"none", cursor: blocked?"not-allowed":"pointer",
            position:"relative", transition:"background 0.2s",
            flexShrink:0,
          }}
        >
          <div style={{
            width:20, height:20, borderRadius:10, background:"#fff",
            position:"absolute", top:3,
            left: on ? 21 : 3,
            transition:"left 0.2s",
            boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
          }}/>
        </button>
      </div>

      {/* Time picker — only shown when on */}
      {on&&(
        <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:4}}>
          <label style={{fontSize:12,color:"#777",flexShrink:0}}>Remind me at</label>
          <input
            type="time" value={localTime}
            onChange={e=>setLocalTime(e.target.value)}
            onBlur={()=>onChange(true, localTime)}
            style={{
              background:"#fff",border:"1.5px solid #E8E8E8",
              borderRadius:8,padding:"6px 10px",fontSize:13,
              fontFamily:"monospace",color:"#000",outline:"none",cursor:"pointer",
            }}
          />
          <span style={{fontSize:11,color:"#AAA"}}>every evening</span>
        </div>
      )}
    </div>
  );
}

// ─── SCORE ROW ───────────────────────────────────────────────────────────────
function ScoreRow({cat,score,onScore,readonly}){
  const scored=score!==undefined;
  return(
    <div style={{background:"#fff",border:`1.5px solid ${scored?GREEN:"#EEE"}`,borderRadius:12,padding:"13px 16px",display:"flex",alignItems:"center",gap:14,transition:"border-color 0.15s"}}>
      <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:scored?GREEN:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:scored?cat.color:"#CCC",transition:"all 0.15s"}}>
        {cat.icon}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,color:"#000"}}>{cat.label}</div>
        <div style={{fontSize:11,color:"#AAA",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.desc}</div>
      </div>
      <div style={{display:"flex",gap:5,flexShrink:0}}>
        {SCORES.map(s=>{
          const active=score===s;
          return(
            <button key={s} onClick={!readonly?()=>onScore(cat.id,s):undefined} style={{
              width:38,height:38,borderRadius:9,
              background:active?GREEN:"#fff",
              border:`1.5px solid ${active?GREEN:"#E8E8E8"}`,
              color:active?"#fff":"#BBB",
              fontSize:11,fontWeight:700,cursor:readonly?"default":"pointer",
              transition:"all 0.12s",fontFamily:FF,
              display:"flex",alignItems:"center",justifyContent:"center",
              transform:active?"scale(1.1)":"scale(1)",
              WebkitTapHighlightColor:"transparent",touchAction:"manipulation",
            }}>{S_SHORT[s]}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CHART VIEW ──────────────────────────────────────────────────────────────
function ChartView({title,subtitle,lineData,xKey,radarData}){
  const avgs=CATS.map(c=>{ const vals=lineData.map(d=>d[c.label]).filter(v=>v!==null&&v!==undefined); return{...c,avg:vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null}; });

  return(
    <div style={{paddingTop:28}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:22,fontWeight:700,color:"#000",letterSpacing:-0.5}}>{title}</div>
        <div style={{fontSize:11,color:"#AAA",marginTop:4,textTransform:"uppercase",letterSpacing:1.5}}>{subtitle}</div>
      </div>

      {/* Category cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
        {avgs.map(c=>(
          <div key={c.id} style={{background:"#fff",border:`1.5px solid ${c.avg!==null?c.color+"40":"#EEE"}`,borderRadius:12,padding:"14px 6px",textAlign:"center"}}>
            <div style={{fontSize:16,color:c.color,marginBottom:6}}>{c.icon}</div>
            <div style={{fontSize:9,fontWeight:600,color:"#AAA",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{c.label}</div>
            <div style={{fontSize:20,fontWeight:700,color:c.avg!==null?scoreColor(c.avg):"#DDD"}}>
              {c.avg!==null?(c.avg>0?`+${c.avg}`:c.avg):"—"}
            </div>
            <div style={{fontSize:9,color:"#AAA",marginTop:3}}>{c.avg!==null?scoreLabel(c.avg):"no data"}</div>
          </div>
        ))}
      </div>

      {/* Radar */}
      <div style={{background:"#fff",border:"1px solid #EEE",borderRadius:14,padding:"20px 12px 10px",marginBottom:16}}>
        <div style={{paddingLeft:8,marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:"#000"}}>Balance Shape</div>
          <div style={{fontSize:12,color:"#AAA",marginTop:2}}>A regular pentagon = harmony across all five areas</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData} margin={{top:8,right:24,left:24,bottom:8}}>
            <PolarGrid stroke="#EEE"/>
            <PolarAngleAxis dataKey="category" tick={{fill:"#555",fontSize:12,fontFamily:FF}}/>
            <Radar dataKey="score" stroke={GREEN} fill={GREEN} fillOpacity={0.1} strokeWidth={2} dot={{fill:GREEN,r:3}}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart */}
      <div style={{background:"#fff",border:"1px solid #EEE",borderRadius:14,padding:"20px 8px 14px"}}>
        <div style={{paddingLeft:12,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:"#000"}}>Trends by Area</div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData} margin={{top:4,right:14,left:-22,bottom:4}}>
            <CartesianGrid stroke="#F5F5F5" strokeDasharray="4 4"/>
            <XAxis dataKey={xKey} tick={{fill:"#AAA",fontSize:10,fontFamily:FF}} axisLine={{stroke:"#EEE"}}/>
            <YAxis domain={[-2,2]} ticks={[-2,-1,0,1,2]} tick={{fill:"#AAA",fontSize:10}} axisLine={{stroke:"#EEE"}}/>
            <Tooltip
              contentStyle={{background:"#fff",border:"1px solid #EEE",borderRadius:10,fontFamily:FF,fontSize:12,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}
              labelStyle={{color:"#000",fontWeight:600}}
              formatter={(v,name)=>[v!==null?(v>0?`+${v}`:v):"—",name]}
            />
            <Legend wrapperStyle={{fontSize:11,fontFamily:FF,paddingTop:12}}/>
            {CATS.map(c=>(
              <Line key={c.id} type="monotone" dataKey={c.label} stroke={c.color} strokeWidth={2}
                dot={{r:3,fill:c.color,strokeWidth:0}} connectNulls={false}
                activeDot={{r:5,stroke:c.color,strokeWidth:2,fill:"#fff"}}/>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
