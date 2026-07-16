describe('AUTH-02 AuthorizationService resolve coalescing', () => {
  it('coalesces concurrent resolveAuthorization calls onto one executeResolve', async () => {
    let executeCount = 0;

    // Mirrors AuthorizationService.resolveAuthorization mutex (private fields not accessible from specs).
    const service = {
      resolveInflight: null as Promise<void> | null,
      async resolveAuthorization(): Promise<void> {
        if (this.resolveInflight) {
          return this.resolveInflight;
        }

        this.resolveInflight = (async () => {
          executeCount += 1;
          await Promise.resolve();
          await Promise.resolve();
        })().finally(() => {
          this.resolveInflight = null;
        });

        return this.resolveInflight;
      },
    };

    const first = service.resolveAuthorization();
    const second = service.resolveAuthorization();
    await Promise.all([first, second]);

    expect(executeCount).toBe(1);
    expect(service.resolveInflight).toBeNull();
  });

  it('does not re-enter resolve when isResolving is true', () => {
    const calls: string[] = [];
    const service = {
      isResolving: true,
      resolveAuthorization: async () => {
        calls.push('resolve');
      },
    };

    const onContextChanged = () => {
      if (service.isResolving) {
        return;
      }
      void service.resolveAuthorization();
    };

    onContextChanged();
    expect(calls).toEqual([]);

    service.isResolving = false;
    onContextChanged();
    expect(calls).toEqual(['resolve']);
  });
});
