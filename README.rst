frontend-app-aspects
#############################

|license-badge| |status-badge| |ci-badge| |codecov-badge|

Purpose
*******

``frontend-app-aspects`` is the frontend application for the Tutor Aspects
plugin. It is built on `frontend-base`_ and ships slot operations/components
that are loaded by the Open edX frontend shell.

This repository is not a template anymore. It is the source of the Aspects
frontend integration code.

What This App Provides
**********************

The app currently contributes an instructor dashboard route widget through
frontend-base slots:

- Slot ID: ``org.openedx.frontend.slot.instructorDashboard.routes.v1``
- Widget ID: ``org.openedx.frontend.widget.instructorDashboard.route.aspects``
- Operation: ``APPEND``
- Rendered component: ``ReportsDashboard``

The ``ReportsDashboard`` widget fetches Superset dashboard configuration and
embeds dashboards using ``@superset-ui/embedded-sdk``.

Runtime/Backend Expectations
****************************

At runtime, the widget expects LMS endpoints used by
``src/widgets/ReportsDashboard/data/api.ts``:

- ``GET {lmsBaseUrl}/aspects/superset_instructor_dashboard/{courseId}/``
  returns dashboard configuration.
- The configuration includes ``superset_guest_token_url`` used to fetch a
  guest token for embedded Superset views.

If these endpoints are unavailable, the widget shows a localized error state.

Prerequisites
*************

- Node version from ``.nvmrc``
- npm
- Tutor development environment (recommended)

For Tutor MFE setup guidance, see `tutor-mfe documentation`_.

Getting Started
***************

TODO: This is generic for now, but we need to add instructions for running this app in a local Tutor environment.
and how to run it with the rest of the instructor dashboard given that this only has a slot for now

1. Clone this repository:

   ``git clone https://github.com/openedx/frontend-app-aspects.git``

2. Install dependencies:

   ``cd frontend-app-aspects && npm install``

3. Start local development server:

   ``npm run dev``

By default, the dev script uses:

- ``PORT=8080``
- ``PUBLIC_PATH=/aspects``

If needed, adjust the ``dev`` script in ``package.json`` to match your Tutor
routing setup.

Local Development Against frontend-base
***************************************

To develop this app together with a local checkout of ``frontend-base``, use
npm workspaces and the existing package scripts:

.. code-block:: sh

    mkdir -p packages/frontend-base
    sudo mount --bind /path/to/frontend-base packages/frontend-base
    npm install
    npm run dev:packages

When finished, unmount with:

.. code-block:: sh

    sudo umount packages/frontend-base

Developing
**********

Common scripts:

- ``npm run dev``: Run the local dev server.
- ``npm run build``: Build library output into ``dist/``.
- ``npm run build:ci``: Run a full app webpack traversal for CI validation.
- ``npm run test``: Run Jest tests with coverage.
- ``npm run lint``: Run lint checks.

Project Structure
*****************

Important paths in this repository:

- ``src/app.ts``: app declaration consumed by ``site.config.*.tsx``
- ``src/constants.ts``: app and role identifiers
- ``src/index.ts``: package exports
- ``src/slots.tsx``: slot operations applied to the shell
- ``src/widgets/ReportsDashboard``: instructor Aspects dashboard widget
- ``src/setupTest.js``: global test setup (including browser API shims)

Internationalization
********************

Please follow the `frontend-base i18n howto`_ for message extraction and
translation workflows.

Getting Help
************

If you are having trouble:

- Open edX forums: https://discuss.openedx.org
- Slack: request an `Open edX Slack invitation`_ and join
  `#wg-frontend`_
- Repository issues:
  https://github.com/openedx/frontend-app-aspects/issues

For broader community help options, see `Getting Help`_.

License
*******

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
************

Contributions are welcome. Please read `How To Contribute`_.

This project accepts bug fixes, security fixes, maintenance work, and feature
work. For larger features, open an issue first to align with maintainers.

The Open edX Code of Conduct
****************************

All community members are expected to follow the `Open edX Code of Conduct`_.

People
******

Maintainers and project metadata are tracked in Backstage from
``catalog-info.yaml`` in this repository.

See `Backstage`_.

Reporting Security Issues
*************************

Do not report security issues publicly. Email security@openedx.org instead.

.. _frontend-base: https://github.com/openedx/frontend-base
.. _tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development
.. _frontend-base i18n howto: https://github.com/openedx/frontend-base/blob/main/docs/how_tos/i18n.rst
.. _Open edX Slack invitation: https://openedx.org/slack
.. _#wg-frontend: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help
.. _How To Contribute: https://openedx.org/r/how-to-contribute
.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/
.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-app-aspects

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-aspects.svg
    :target: https://github.com/openedx/frontend-app-aspects/blob/main/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-app-aspects/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-aspects/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-aspects/coverage.svg?branch=main
    :target: https://codecov.io/github/openedx/frontend-app-aspects?branch=main
    :alt: Codecov
