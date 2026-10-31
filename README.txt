MEDSHIP — WORKING APPLICATION
=============================

QUICK START
1. Extract medship-working-app.zip.
2. Open index.html in Chrome, Edge, Firefox or another modern browser.
3. The app starts on the Overview dashboard. No npm install or build step is needed.
4. Use the left navigation to open each module.

FEATURES
- Overview dashboard with live KPI cards, attention alerts, recent dispatches, customer shelf-life policies and quick actions.
- Batch Inventory with search, status/product filters, clickable batch details, batch registration and QA review queue.
- New batch registration. New batches always start UNDER QC; they are not dispatchable until QA releases them.
- Hospital Orders with four sample hospitals, customer-specific shelf-life rules and order creation.
- FEFO Allocation. Mandatory gates run before sorting: RELEASED status, unexpired batch, cold-chain evidence (if applicable), 2–8°C recorded readings and the hospital's minimum remaining shelf life.
- Allocation results show picked batches and explicit reasons for excluded batches.
- Temperature Monitoring with recorded readings, 2–8°C reference band, ability to add readings and automatic quarantine of a batch when a recorded reading is outside range.
- QA can release UNDER QC batches after recording a review note. A quarantined temperature-excursion batch stays blocked in this demo and can only remain quarantined or be rejected.
- Dispatch confirmation rechecks batch eligibility and stock, prevents duplicate confirmation, deducts available quantities and records a dispatch entry.
- Dispatch History with batch-level traceability, CSV export and printable dispatch notes.
- Browser localStorage persistence and a Reset demo control.

SAMPLE SCENARIOS
- City General + Ringer Lactate: RL-201 has 175 days remaining, below the 180-day policy; RL-202 is selected first.
- District Rural + Normal Saline: NS-101 has 60 days remaining, below the 90-day policy; NS-102 is the earliest eligible lot.
- Sunrise Children's + Dengue NS1 Kit: DNG-401 has 100 days remaining, below the 270-day policy; DNG-402 is eligible.
- INS-302 has a recorded 11.4°C excursion and is quarantined.
- CEF-501 is under QC; CEF-502 is expired.

DATA & LIMITATIONS
This is a working front-end demonstration. All records are synthetic and stored locally in the browser that opens the file. Data is not synchronized across users or devices. There is no authentication, role-based access control, server-side transaction processing or immutable audit log. The temperature samples are periodic records and do not prove continuous monitoring or uninterrupted cold-chain control.

Do not use this prototype as a validated GDP/QMS, regulated quality-management or production dispatch system. A production release needs backend persistence, authentication and role controls, transactional stock reservation, immutable audit history, backups, integration with validated monitoring devices and regulatory validation.

TESTING
The FEFO engine in the companion Next.js project passed its six scenario groups. The standalone UI smoke checks covered navigation, batch registration, QA release, FEFO selection/exclusion, dispatch stock deduction, temperature logging and automatic quarantine.
