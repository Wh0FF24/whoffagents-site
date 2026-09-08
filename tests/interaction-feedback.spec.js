import {test,expect} from '@playwright/test';
test('hover is tailored without blanket outlines; keyboard focus remains visible',async({page})=>{
 await page.goto('/');
 const logo=page.getByRole('banner').getByRole('link',{name:'Whoff Agents home'});
 await logo.hover();await expect(logo).toHaveCSS('opacity','1');await expect(logo).toHaveCSS('outline-style','none');
 const button=page.getByRole('button',{name:'Open the pyramid'});
 const resting=await button.evaluate(el=>getComputedStyle(el).borderBottomColor);
 await button.hover();await expect(button).not.toHaveCSS('border-bottom-color',resting);await expect(button).toHaveCSS('outline-style','none');
 const card=page.locator('.py-directions a').first();await card.hover();await expect(card).toHaveCSS('outline-style','none');await expect(card).toHaveCSS('text-decoration-line','none');
 await page.screenshot({path:'C:/Users/WillW/Documents/Codex/2026-09-06/go-x20/outputs/hover-polish.png'});
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await expect(page.locator(':focus')).toHaveCSS('outline-style','solid');
});
