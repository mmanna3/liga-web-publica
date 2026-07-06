const ACCORDION_GROUP_CLASS = 'torneo-accordion-group';
const ACCORDION_SIBLING_SELECTOR = ':scope > .glass > details.torneo-disclosure';

export function initTorneoAccordion(root: HTMLElement): void {
  root.addEventListener(
    'toggle',
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement) || !target.classList.contains('torneo-disclosure')) {
        return;
      }
      if (!target.open) return;

      const group = target.closest(`.${ACCORDION_GROUP_CLASS}`);
      if (!group) return;

      group.querySelectorAll<HTMLDetailsElement>(ACCORDION_SIBLING_SELECTOR).forEach((other) => {
        if (other !== target) {
          other.open = false;
        }
      });
    },
    true,
  );
}
