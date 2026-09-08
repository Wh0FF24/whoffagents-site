import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('home pyramid opens and navigates to layered websites',async({page})=>{
 await page.goto('/');await page.keyboard.press('Shift');await expect(page.locator('.py-hero')).toHaveAttribute('data-scene','ready');
 await expect(page.locator('.py-canvas')).toHaveAttribute('data-faces','3'); const before=await page.locator('.py-canvas canvas').screenshot();await page.getByRole('button',{name:'Open the pyramid'}).click();await expect(page.locator('.py-canvas')).toHaveAttribute('data-open','1.000');expect(before.equals(await page.locator('.py-canvas canvas').screenshot())).toBe(false);
 await page.screenshot({path:'C:/Users/WillW/Documents/Codex/2026-09-06/go-x20/outputs/pyramid-home.png',fullPage:false});
 await page.locator('.py-directions a').first().click();await expect(page.locator('.lp-experience')).toHaveCount(1);
 await page.getByRole('banner').getByRole('link',{name:'Whoff Agents home'}).click();await expect(page.locator('.py-hero')).toHaveCount(1);await expect(page.locator('.lp-experience')).toHaveCount(0);
});
test('pyramid fits mobile with accessible controls and fallback',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).include('.py-hero').analyze()).violations).toEqual([]);
 await page.keyboard.press('Shift');await expect(page.locator('.py-hero')).toHaveAttribute('data-scene','ready');
 await page.locator('canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await expect(page.locator('.py-poster')).toBeVisible();await expect(page.locator('.py-directions a')).toHaveCount(3);
});

test('scroll keeps pyramid on screen until it opens, then releases the section',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');await page.keyboard.press('Shift');await expect(page.locator('.py-hero')).toHaveAttribute('data-scene','ready');
 const range=await page.locator('.py-hero').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:el.offsetHeight-(innerHeight-86)}));
 await page.evaluate(({top,travel})=>scrollTo({top:top-86+travel*.82,behavior:'instant'}),range);
 await expect.poll(()=>page.locator('.py-canvas').getAttribute('data-open')).toBe('1.000');
 expect(await page.locator('.py-stage').evaluate(el=>Math.abs(el.getBoundingClientRect().top-86))).toBeLessThan(2);
 expect(await page.locator('.py-canvas').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight)).toBe(true);
 await page.evaluate(({top,travel})=>scrollTo({top:top+travel+450,behavior:'instant'}),range);
 await expect.poll(()=>page.locator('.py-stage').evaluate(el=>el.getBoundingClientRect().top)).toBeLessThan(0);
});

test('service selection changes sculpture, useful details, and destination without requiring WebGL',async({page})=>{
 await page.goto('/');await page.keyboard.press('Shift');await expect(page.locator('.py-hero')).toHaveAttribute('data-scene','ready');
 await page.getByRole('button',{name:'AI agents',exact:true}).click();await expect(page.locator('.py-canvas')).toHaveAttribute('data-selection','1');await expect(page.locator('.py-service-detail a')).toHaveAttribute('href','/agents');await expect(page.locator('.py-service-detail')).toContainText('phone intake');
 await page.getByRole('button',{name:'Developer tools',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.py-service-detail a')).toHaveAttribute('href','/products');
 await page.locator('.py-canvas canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await expect(page.locator('.py-poster')).toBeVisible();await page.getByRole('button',{name:'Websites',exact:true}).click();await expect(page.locator('.py-service-detail a')).toHaveAttribute('href','/web');
});

test('a pointer can select a service directly from a pyramid face',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.keyboard.press('Shift');await expect(page.locator('.py-hero')).toHaveAttribute('data-scene','ready');
 const box=await page.locator('.py-canvas').boundingBox();let clicked=false;
 for(const x of [.4,.5,.6]){for(const y of [.45,.55,.65]){await page.mouse.move(box.x+box.width*x,box.y+box.height*y);if(await page.locator('.py-canvas').evaluate(el=>el.style.cursor==='pointer')){await page.mouse.click(box.x+box.width*x,box.y+box.height*y);clicked=true;break;}}if(clicked)break;}
 expect(clicked).toBe(true);await expect.poll(()=>page.locator('.py-canvas').getAttribute('data-open')).toBe('0.650');await expect(page.locator('.py-service-picker button[aria-pressed="true"]')).toHaveCount(1);
});

test('pinned scroll presents Websites then AI agents then Developer tools',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.keyboard.press('Shift');await expect(page.locator('.py-hero')).toHaveAttribute('data-scene','ready');
 const range=await page.locator('.py-hero').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:el.offsetHeight-(innerHeight-86)}));
 for(const [progress,index,href] of [[.1,0,'/web'],[.45,1,'/agents'],[.8,2,'/products']]){
  await page.evaluate(({top,travel,progress})=>scrollTo({top:top-86+travel*.8*progress,behavior:'instant'}),{...range,progress});
  await expect(page.locator('.py-service-picker button').nth(index)).toHaveAttribute('aria-pressed','true');await expect(page.locator('.py-service-detail a')).toHaveAttribute('href',href);await expect(page.locator('.py-canvas')).toHaveAttribute('data-selection',String(index));
 }
});
