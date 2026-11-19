import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropertiesNamespace } from '../enums/shop.enums';
import { SHELL_PROPERTIES_RAW } from '../properties/shell.properties';
import { SNEAKERS_PROPERTIES_RAW } from '../../shops/sneakers/properties/sneakers.properties';
import { STREETWEAR_PROPERTIES_RAW } from '../../shops/streetwear/properties/streetwear.properties';
import { COLLECTIBLES_PROPERTIES_RAW } from '../../shops/collectibles/properties/collectibles.properties';

export type PropertyBag = Readonly<Record<string, string>>;
export type PropertyInterpolationParams =
  | ReadonlyArray<string | number>
  | Readonly<Record<string, string | number>>;

export function parsePropertiesContent(rawContent: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = rawContent.split(/\r?\n/);

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) {
      continue;
    }

    const eqIdx = trimmed.indexOf('=');
    const colonIdx = trimmed.indexOf(':');
    let splitIdx = -1;

    if (eqIdx !== -1 && colonIdx !== -1) {
      splitIdx = Math.min(eqIdx, colonIdx);
    } else {
      splitIdx = eqIdx !== -1 ? eqIdx : colonIdx;
    }

    if (splitIdx === -1) {
      continue;
    }

    const key = trimmed.slice(0, splitIdx).trim();
    const rawValue = trimmed.slice(splitIdx + 1).trim();
    if (key) {
      result[key] = rawValue.replace(/\\n/g, '\n');
    }
  }

  return result;
}

export function formatPropertyTemplate(
  template: string,
  params?: PropertyInterpolationParams
): string {
  if (!params) {
    return template;
  }

  if (Array.isArray(params)) {
    return template.replace(/\{(\d+)\}/g, (match, indexStr: string) => {
      const idx = Number(indexStr);
      const val = params[idx];
      return val !== undefined ? String(val) : match;
    });
  }

  const recordParams = params as Readonly<Record<string, string | number>>;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, paramKey: string) => {
    const val = recordParams[paramKey];
    return val !== undefined ? String(val) : match;
  });
}

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  private readonly http = inject(HttpClient, { optional: true });

  private readonly bundles = signal<Readonly<Record<PropertiesNamespace, PropertyBag>>>({
    [PropertiesNamespace.SHELL]: parsePropertiesContent(SHELL_PROPERTIES_RAW),
    [PropertiesNamespace.SNEAKERS]: parsePropertiesContent(SNEAKERS_PROPERTIES_RAW),
    [PropertiesNamespace.STREETWEAR]: parsePropertiesContent(STREETWEAR_PROPERTIES_RAW),
    [PropertiesNamespace.COLLECTIBLES]: parsePropertiesContent(COLLECTIBLES_PROPERTIES_RAW)
  });

  get(
    namespace: PropertiesNamespace | `${PropertiesNamespace}`,
    key: string,
    params?: PropertyInterpolationParams
  ): string {
    const ns = namespace as PropertiesNamespace;
    const bag = this.bundles()[ns];
    const template = bag?.[key] ?? key;
    return formatPropertyTemplate(template, params);
  }

  createScopedResolver(
    namespace: PropertiesNamespace | `${PropertiesNamespace}`
  ): (key: string, params?: PropertyInterpolationParams) => string {
    return (key: string, params?: PropertyInterpolationParams): string =>
      this.get(namespace, key, params);
  }

  getBundle(namespace: PropertiesNamespace | `${PropertiesNamespace}`): PropertyBag {
    return this.bundles()[namespace as PropertiesNamespace];
  }

  refreshNamespaceFromAsset(namespace: PropertiesNamespace): void {
    if (!this.http) {
      return;
    }
    this.http
      .get(`/assets/properties/${namespace}.properties`, { responseType: 'text' })
      .subscribe({
        next: (rawText: string) => {
          const parsed = parsePropertiesContent(rawText);
          if (Object.keys(parsed).length > 0) {
            this.bundles.update(current => ({
              ...current,
              [namespace]: {
                ...current[namespace],
                ...parsed
              }
            }));
          }
        },
        error: () => {
          // Retain embedded bundle fallback
        }
      });
  }
}
