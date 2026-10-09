# Fixture freeze contract

A fixture is frozen when an implementation-blind verifier independently reproduces every declared expected value from its inputs and reviewed specification, finds no unresolved requirement within its declared scope, and records a reproducible command with exit 0; input-only or incomplete fixtures remain candidates.

Paired input/expected files are evaluated together. A fully specified analytic
helper fixture can freeze without a finished clone implementation. Freezing is
immutability of verified input/oracle data, not product acceptance, image parity,
completion of F01/F02/F03/P01, or held-out acceptance. Missing implementation
alone does not block analytic verification. Missing settings, outputs or source
contracts do block fixtures claiming those scopes; do not shrink that scope just
to freeze them.

The current inventory is the 16 JSON files in this directory. Per-file verifier
identity, method, command, exit, payload hashes and unresolved reasons are
recorded in `state/sprite-fixture-freeze.md`. That record is the author's local
working evidence and is NOT part of this repository, so this path does not
resolve in a fresh checkout; the frozen payloads it describes are the 16 JSON
files here. Verification tools must not import/read clone
implementation or tests, render, encode, launch the reference app or use assets.
Metadata-only freeze annotations do not change the verified numeric payload.
