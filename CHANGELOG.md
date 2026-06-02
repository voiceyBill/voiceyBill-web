# Changelog

## [1.3.0](https://github.com/voiceyBill/voiceyBill-web/compare/voiceybill-client-v1.2.0...voiceybill-client-v1.3.0) (2026-06-02)


### Features

* Add delete account feature with confirmation and API integration ([360adf5](https://github.com/voiceyBill/voiceyBill-web/commit/360adf50226460cbf56685079b421a99966fa0d7))
* Add voice input support for budget setting ([9972e4f](https://github.com/voiceyBill/voiceyBill-web/commit/9972e4f57fb2132ddd5dea4b64321e22fb7f091d))


### Bug Fixes

* **client:** Align date picker weekday headers ([#136](https://github.com/voiceyBill/voiceyBill-web/issues/136)) ([658f0f2](https://github.com/voiceyBill/voiceyBill-web/commit/658f0f2d2b40399d749f5876983d52a466a58547))
* **ui:** Improve footer UI spacing and navigation consistency ([dad2bb4](https://github.com/voiceyBill/voiceyBill-web/commit/dad2bb4ca936ca8f5ade0106047f83e849644838))

## [1.2.0](https://github.com/voiceyBill/voiceyBill-web/compare/voiceybill-client-v1.1.0...voiceybill-client-v1.2.0) (2026-05-29)


### Features

* **client:** Implement multi currency support ([1b493e4](https://github.com/voiceyBill/voiceyBill-web/commit/1b493e4152c64af69d10d2396e99b923ecdf549a))


### Bug Fixes

* Add change password option in Settings ([#73](https://github.com/voiceyBill/voiceyBill-web/issues/73)) ([25ad4c1](https://github.com/voiceyBill/voiceyBill-web/commit/25ad4c164ebcbee32da0f2d87194baa6bb97559f))
* address copilot review comments for multi-currency support ([f2cf09d](https://github.com/voiceyBill/voiceyBill-web/commit/f2cf09d4d5ffec7567674f74a6e73fa66b40c437))
* **auth:** resolve dark mode inconsistency across authentication pages ([704d31c](https://github.com/voiceyBill/voiceyBill-web/commit/704d31c1f1013ccb92c758d4bad45b41401a9ad7))
* **auth:** Resolve dark mode inconsistency across authentication pages ([79a2c5a](https://github.com/voiceyBill/voiceyBill-web/commit/79a2c5a99b94b9c2a31a71a3feefd4df085ea19b))
* correct zero/NaN fallback in formatCurrency to use Intl.NumberFormat ([515d993](https://github.com/voiceyBill/voiceyBill-web/commit/515d993cef5bad6d74d8674aa4c2e7e8d962f27e))
* **notification:** close popup on outside click ([ef70484](https://github.com/voiceyBill/voiceyBill-web/commit/ef70484a95ccc9f7418dd3c4b06d33cb30a89100))
* **notification:** Close popup on outside click ([53bea3a](https://github.com/voiceyBill/voiceyBill-web/commit/53bea3a389e3972313c078d81204a7905c52b824))

## [1.1.0](https://github.com/voiceyBill/voiceyBill-web/compare/voiceybill-client-v1.0.0...voiceybill-client-v1.1.0) (2026-05-28)


### Features

* Add budget navigation button and feature ([1bbc168](https://github.com/voiceyBill/voiceyBill-web/commit/1bbc1680bd354a1c1d9fc60c8145fdaad4cea66c))
* **client:** Comprehensive UI/UX overhaul — dashboard, auth, sidebar, and landing page ([4c75923](https://github.com/voiceyBill/voiceyBill-web/commit/4c75923116486191b7e540d5548d74d8035dc371))
* **resend-report:** add resend report email action with RTK mutation and row-level loading ([1fdc4b9](https://github.com/voiceyBill/voiceyBill-web/commit/1fdc4b94434fdb1ec1671225035ed7fbe7a8e679))
* **resend-report:** Add resend report email action with RTK mutation and row-level loading. ([c892c4f](https://github.com/voiceyBill/voiceyBill-web/commit/c892c4f7acdf27aa41e500bc3ecb65dde36fd929))
* **ui:** overhaul landing page, dashboard, auth screens, sidebar, and navigation for responsiveness ([230feb9](https://github.com/voiceyBill/voiceyBill-web/commit/230feb998e689e68f14b2057bd42c1e6552099c8))
* **ui:** redesign landing page, auth screens, and hero parallax ([67fb063](https://github.com/voiceyBill/voiceyBill-web/commit/67fb06363bd2914f4d10ce7cfdf7d48dad7dde1b))
* **ui:** Redesign landing page, auth screens, and hero scroll parallax ([2835467](https://github.com/voiceyBill/voiceyBill-web/commit/28354671aae2fa783f886b4d3bf37994fd7a093f))
* **ui:** refactor dashboard layout, sidebar navigation, and transaction table components ([82a053b](https://github.com/voiceyBill/voiceyBill-web/commit/82a053be7e19ebf10edc2ca8a5ab6bf24c078bd0))
* **ui:** replace hardcoded hex colors with CSS tokens and add theme toggle ([6a353f2](https://github.com/voiceyBill/voiceyBill-web/commit/6a353f2d570cd0233961927bf3b97b729ca85a1b))


### Bug Fixes

* **account:** prevent update when no changes made ([57bf287](https://github.com/voiceyBill/voiceyBill-web/commit/57bf287ddb0d26b3b69ab4893cfec727947d1551))
* **ci:** add missing emnapi lock entries ([1f8663b](https://github.com/voiceyBill/voiceyBill-web/commit/1f8663bd0ee0ab74e8161c72ecb0d362e3c6dd18))
* **ci:** sync package-lock for npm ci ([85530c8](https://github.com/voiceyBill/voiceyBill-web/commit/85530c8392bd9273e75c8b659a336f94ee428494))
* **ci:** Sync package-lock for npm ci ([8b332d8](https://github.com/voiceyBill/voiceyBill-web/commit/8b332d8c4cba038db3e28d70b6c999243b182cb9))
* correct API field name transactions (typo fix) ([9eaed79](https://github.com/voiceyBill/voiceyBill-web/commit/9eaed79e8aa1ba530059a0e6f12cc7cadb91deff))
* Correct API field name transactions (typo fix) ([1659c69](https://github.com/voiceyBill/voiceyBill-web/commit/1659c6903d944940c02af0024cb3e5000b91d986))
* dashboard overview stats cards summary ([413c11e](https://github.com/voiceyBill/voiceyBill-web/commit/413c11e236b3c048bafab4076538e38d488cee46))
* Dashboard overview stats cards summary ([5b7b7ef](https://github.com/voiceyBill/voiceyBill-web/commit/5b7b7efa484eebd7e293efa2c60950e6ab4e274e))
* **data-table:** prepend reset option to filter dropdown ([b2d601f](https://github.com/voiceyBill/voiceyBill-web/commit/b2d601f395544d59fd52306d70da838f95b91e6b))
* **data-table:** Prepend reset option to filter dropdown ([0c0ec0d](https://github.com/voiceyBill/voiceyBill-web/commit/0c0ec0d55bb787c95f9a6cc5c1167386a5dff531))
* disable update preferences button when no changes are made ([9e52d77](https://github.com/voiceyBill/voiceyBill-web/commit/9e52d77c71911a1fe158f2e0f4a8ef60da5a8721))
* Disable update preferences button when no changes are made ([7ed5f24](https://github.com/voiceyBill/voiceyBill-web/commit/7ed5f242912b4c769bd1090fe2e4b2f081da911c))
* **docs:** replace relative cross-repo link with absolute GitHub URL ([3b83958](https://github.com/voiceyBill/voiceyBill-web/commit/3b83958cf4d3d716fc4fe7a632d91183c96422c4))
* **docs:** Replace relative cross-repo link with absolute GitHub URL ([0527084](https://github.com/voiceyBill/voiceyBill-web/commit/0527084b4590ab9e2e458b9680893cbcb6d331e5))
* enforce password strength validation in auth forms ([b5699c7](https://github.com/voiceyBill/voiceyBill-web/commit/b5699c75d826143cd0dcb35835841c7564fcdd21))
* Enforce password strength validation in auth forms ([1adae25](https://github.com/voiceyBill/voiceyBill-web/commit/1adae250dde34697806747c9f6912c6dc69c78d6))
* enforce password strength validation in auth validator and auth forms ([c136a42](https://github.com/voiceyBill/voiceyBill-web/commit/c136a4201e6409a93d443e4897f2f656acafa616))
* **lint:** remove unused signup import ([23b3d1a](https://github.com/voiceyBill/voiceyBill-web/commit/23b3d1a3847a675cfebaf8583bef0bc2b9508dd4))
* Prevent update when no changes are made ([59889c2](https://github.com/voiceyBill/voiceyBill-web/commit/59889c2d2d3307b2617a5d6f79896434cb1e8b0c))
* remove sensitive console logs from voice recorder ([dcf69fb](https://github.com/voiceyBill/voiceyBill-web/commit/dcf69fbf18821bcfda40335a4bade693ae87d836))
* Remove sensitive console logs from voice recorder ([40eaf70](https://github.com/voiceyBill/voiceyBill-web/commit/40eaf70247ffc7ad0997a1b5a498029f4eb1ff65))
* remove unnecessary console statements ([1558f89](https://github.com/voiceyBill/voiceyBill-web/commit/1558f891f479d35e70f629902fb8b188cdc6111e))
* Remove unnecessary console statements from frontend components and hooks ([53f4467](https://github.com/voiceyBill/voiceyBill-web/commit/53f4467eef096bb95cb715bdbace06d462514ea2))
* **resend-report:** replace any with unknown in try-catch for safer error handling ([65c55f3](https://github.com/voiceyBill/voiceyBill-web/commit/65c55f37981cf911711e87404787dc19821299c0))
* **sidebar:** remove unused onToggle prop to resolve TypeScript build error ([4e93ba3](https://github.com/voiceyBill/voiceyBill-web/commit/4e93ba3ca57a80260b76af3bec51482024c10334))
* **sidebar:** Remove unused onToggle prop to resolve TypeScript build error ([fc062de](https://github.com/voiceyBill/voiceyBill-web/commit/fc062de3c9823e6dec0a0e5c699d9b29e96ed2e4))
* **table-skeleton-layout-shift:** improve table skeleton loading height and row handling ([6dc41a4](https://github.com/voiceyBill/voiceyBill-web/commit/6dc41a4674dadb5d8a3dde3035fa4f445679319c))
* **table-skeleton-layout-shift:** improve table skeleton loading height match with not-found component and transaction table  component ([c935eeb](https://github.com/voiceyBill/voiceyBill-web/commit/c935eeb727a4ce37bd9d690356f306b782c707d2))
* The skeleton height not matching the component size. ([949fc6c](https://github.com/voiceyBill/voiceyBill-web/commit/949fc6c52593fc32b0782538ba9802d19d9a2c4a))
* **transaction-form:** trim whitespace before title length validation ([e1bb113](https://github.com/voiceyBill/voiceyBill-web/commit/e1bb1135321d3093b12d38d9ec30f6c773c435bb))
* **transaction-form:** Trim whitespace before title length validation ([e1f7897](https://github.com/voiceyBill/voiceyBill-web/commit/e1f7897be9f493b28938c2387527ad4f9fa0ca8f))
* **web:** reduce table skeleton rows to improve loading UX ([9c9829b](https://github.com/voiceyBill/voiceyBill-web/commit/9c9829be7298bd4d20878e0876fd0810f64ae3bd))
* **web:** Reduce table skeleton rows to improve loading UX ([c125230](https://github.com/voiceyBill/voiceyBill-web/commit/c12523033d635c96c5b9020c82aa16071c9cc379))

## 1.0.0 (2026-05-17)


### Features

* add ci/cd workflows, issue templates, and governance docs ([c7548bf](https://github.com/voiceyBill/voiceyBill-web/commit/c7548bf94c9f70b5b83b7fcbd0fb2baf87a96605))
* **auth:** Improve password visibility and OTP flows ([aa2ea36](https://github.com/voiceyBill/voiceyBill-web/commit/aa2ea3667e5b5bd02d3a858c10feebb5187d7fe9))
* **design:** Establish brand design system, refactor home page, and … ([5820295](https://github.com/voiceyBill/voiceyBill-web/commit/5820295a757c97c103f5489ce93efaedfd4b6772))
* **design:** Establish brand design system, refactor home page, and fix dark-mode tokens ([c306c0a](https://github.com/voiceyBill/voiceyBill-web/commit/c306c0a144db4e044151c78444491c147f7ad890))
