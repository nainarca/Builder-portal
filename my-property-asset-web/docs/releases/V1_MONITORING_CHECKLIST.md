# V1 Monitoring & Logging Checklist

## Monitoring

| Signal | Target | V1 Status |
|---|---|---|
| Uptime / availability | 99.9% | Ops health UI (mock) |
| Auth failure rate | Alert on spike | Not wired |
| API latency p95 | < 300ms | N/A (in-memory) |
| Error rate | < 1% | Needs APM |
| DB connection health | Green | Supabase dashboard |
| Storage errors | Alert | Pending |
| Support ticket queue depth | Trend | Support Center |

## Logging Strategy

| Layer | Approach |
|---|---|
| Angular | Console + future remote logger |
| Auth | Supabase Auth logs |
| Database | Supabase logs + `audit_logs` |
| Platform audit | P16 audit repository / SQL `audit_logs` |
| Support | Ticket notes + audit category `support` |

## Error Tracking

- Placeholder providers listed in Super Admin Operations telemetry.  
- **Action:** integrate Sentry/App Insights before production GO.

## Pre-release Monitoring Checklist

- [ ] Alerts defined for 5xx / auth spikes  
- [ ] Dashboard for Supabase resource usage  
- [ ] On-call rota documented  
- [ ] Maintenance mode tested  
- [ ] Audit log retention policy agreed  
