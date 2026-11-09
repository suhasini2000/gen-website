# Browser smoke tests

The timestamped `test_script.py` files use `smoke_test.py` to check public page
rendering, language persistence, the AI-training redirect, and the contact form.
They do not submit forms or sign in to the admin area.

Install Playwright and its Chromium browser:

```sh
python -m pip install playwright
python -m playwright install chromium
```

Start the frontend with `cd frontend && yarn start`, then run a script, for
example:

```sh
python test_reports/browser/automation_output/20261107_150642_e8d49/test_script.py
```

The scripts use `http://127.0.0.1:3000` by default. Set `BASE_URL` to test a
different running frontend. Screenshots and console logs are written beside
the corresponding script when configured.
