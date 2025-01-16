name: Update Wildfire Data

on:
  schedule:
    - cron: '0 */2 * * *'
  workflow_dispatch:

jobs:
  update-data:
    runs-on: ubuntu-22.04
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.12'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install requests beautifulsoup4
    - name: Run wildfire data script
      run: python update_wildfires.py
    - name: Commit and push if changed
      run: |
        git config --global user.name 'GitHub Actions'
        git config --global user.email 'actions@github.com'
        git add wildfire_data.json
        git diff --quiet && git diff --staged --quiet || (git commit -m "Update wildfire data" && git push)
