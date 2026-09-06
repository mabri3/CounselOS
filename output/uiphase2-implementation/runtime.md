# Runtime and isolation

The coordinator and all implementation workers used gpt-6-astra with low reasoning. The contract reviewer and fresh final reviewer used gpt-5.6-sol with medium reasoning. Exact session logs and observed routing are in actual-routing.json. No more than three implementation workers ran beside the coordinator. Reused workers completed their prior file handoff before taking another owned chunk.

The owned frontend used port 3134, `PHASE2_DIST_DIR=.next-phase2-dev`, and `NEXT_PUBLIC_API_BASE_URL=http://localhost:8134/api`. Production verification used `.next-phase2-build`. Normal `.next` was not removed or rebuilt. Next-generated tsconfig includes were restored to the hash-verified baseline after checks.

The owned backend used port 8134 and isolated_server.py. It selected test-root/vault through test-root/active-vault.json, disabled scheduling and used the offline mock provider. The harness configured a controlled partial Watch scan. The experimental preview mock was removed; successful previews used stock mock output and the existing draft recovery path.

Both owned services were stopped after browser verification. The owned two in-app browser tabs were closed and the viewport override reset. User services on 3000/8000 were not stopped. The isolated fixtures, screenshots, logs and generated Phase 2 build directories remain available for inspection.

The browser reported scale 1.1. Physical viewport calibration produced the recorded native CSS widths. Separate real scroll captures replaced unreliable full-page stitching. The user waived 200% zoom.
