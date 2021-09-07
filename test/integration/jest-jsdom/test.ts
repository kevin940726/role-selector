import { query, queryAll, suggestSelector } from '../../../browser';

test('role selector', () => {
  document.body.innerHTML = `
    <button aria-pressed="true">Button 1</button>
    <button disabled>Button 2</button>
    <button aria-expanded="true">Button 3</button>
  `;

  expect(query(document.body, 'button')!.textContent).toBe('Button 1');
  expect(query(document.body, 'button[name="Button 1"]')!.textContent).toBe(
    'Button 1'
  );
  expect(queryAll(document.body, 'button[name=/button/i]')).toHaveLength(3);

  const button1 = document.querySelector('button');
  expect(suggestSelector(button1)).toEqual({
    type: 'role',
    selector: 'button[name="Button 1"]',
  });
});
