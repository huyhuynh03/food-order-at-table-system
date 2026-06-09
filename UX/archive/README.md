# Archive — Legacy / Unused Code

This folder holds historical code that is **not** part of the deployed application. It is kept for reference only and is excluded from the production build.

## Contents

| File | Description |
|------|-------------|
| `ai-chatbot.js` | First **beta** version of the AI chatbot module (self-injecting widget). It is **not** loaded by the production app. The shipped chatbot lives inline inside [`customer.html`](../customer.html) / [`js/customer.js`](../js/customer.js) and is more complete. |

## Notes

- Nothing in this folder is referenced by any HTML page via `<script src>`.
- Safe to delete if you no longer need the historical reference.
