import { TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  beforeEach(() => localStorage.removeItem('theme'));
  afterEach(() => document.documentElement.removeAttribute('data-theme'));

  async function render() {
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    return { fixture, button };
  }

  it('is one named switch: "Dark theme", off in the light theme, with a moon', async () => {
    const { button } = await render();
    expect(button.getAttribute('aria-label')).toBe('Dark theme');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.textContent?.trim()).toBe('');
    expect(button.querySelector('circle')).toBeNull();
  });

  it('turns the dark theme on, shows a sun and remembers the choice', async () => {
    const { fixture, button } = await render();
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.querySelector('circle')).not.toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
