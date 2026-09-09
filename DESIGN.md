# Design

The system uses a layered architecture: ingestion -> generation/validation -> review -> scheduling -> publishing adapters -> audit history. SQLite is the durable state store. The adapter factory isolates external platform integrations from business logic, while deterministic idempotency keys prevent duplicate publication.