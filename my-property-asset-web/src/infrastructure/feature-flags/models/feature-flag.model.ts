export interface FeatureFlagDefinition {
  key: string;
  description: string;
  defaultEnabled: boolean;
  remoteCapable: boolean;
}

export type FeatureFlagOverrideMap = Record<string, boolean>;
