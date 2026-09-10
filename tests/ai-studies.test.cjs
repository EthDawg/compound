const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const {renewalReady,launchReady,patchInitial,patchReducer,patchResults,patchBefore,INITIAL_TOOL,toolReducer,takeKey,takeCurrent,dubInitial,dubCanAccept,canReleaseAgent,agentTestResults}=require('../lib/data/ai-scenarios.ts');

test('a Cowork brief needs shared sources, the agreement and adoption evidence, and the governing date',()=>{
  const evidence=['contract','usage'];
  assert.equal(renewalReady(false,evidence,'1 October 2026'),false);
  assert.equal(renewalReady(true,['notes','usage'],'1 October 2026'),false);
  assert.equal(renewalReady(true,['contract'],'1 October 2026'),false);
  assert.equal(renewalReady(true,evidence,'1 November 2026'),false);
  assert.equal(renewalReady(true,evidence,'1 October 2026'),true);
});

test('a Work artifact cannot inherit the old launch scope or skip support evidence',()=>{
  assert.equal(launchReady(['brief'],'all'),false);
  assert.equal(launchReady(['scope'],'anz'),false);
  assert.equal(launchReady(['scope','support'],'all'),false);
  assert.equal(launchReady(['scope','support'],'anz'),true);
});

test('Manual coding requires both edit approval and scoped command approval, including after a revision',()=>{
  let state=patchInitial(false,true);
  assert.strictEqual(patchReducer(state,{type:'test'}),state);
  state=patchReducer(state,{type:'permission'});
  assert.strictEqual(patchReducer(state,{type:'test'}),state);
  state=patchReducer(state,{type:'inspect'});
  state=patchReducer(state,{type:'test'});
  assert.deepEqual(patchResults(state.tested),[true,true,false]);
  assert.strictEqual(patchReducer(state,{type:'accept'}),state);
  state=patchReducer(state,{type:'revise'});
  assert.equal(state.inspected,0);
  assert.equal(state.tested,0);
  assert.strictEqual(patchReducer(state,{type:'test'}),state);
  state=patchReducer(state,{type:'inspect'});
  state=patchReducer(state,{type:'test'});
  state=patchReducer(state,{type:'accept'});
  assert.equal(state.accepted,true);
  assert.strictEqual(patchReducer(state,{type:'revise'}),state);
});

test('isolated coding can run checks before human review but staging requires the current passing revision',()=>{
  let state=patchReducer(patchInitial(true),{type:'test'});
  assert.equal(state.tested,1);
  state=patchReducer(state,{type:'revise'});
  state=patchReducer(state,{type:'test'});
  assert.strictEqual(patchReducer(state,{type:'accept'}),state);
  state=patchReducer(state,{type:'inspect'});
  state=patchReducer(state,{type:'accept'});
  assert.equal(state.accepted,true);
  assert.match(patchBefore(2,'last'),/while \(true\)/);
  assert.equal(patchBefore(2,'branch'),'return await sendRequest();');
  assert.notEqual(patchBefore(2,'last'),patchBefore(2,'branch'));
});

test('tool authority is not execution; denial and failure cannot produce a completion receipt',()=>{
  assert.strictEqual(toolReducer(INITIAL_TOOL,{type:'approve'}),INITIAL_TOOL);
  assert.strictEqual(toolReducer(INITIAL_TOOL,{type:'result',success:true}),INITIAL_TOOL);
  const denied=toolReducer(INITIAL_TOOL,{type:'deny'});
  assert.strictEqual(toolReducer(denied,{type:'result',success:true}),denied);
  let state=toolReducer(INITIAL_TOOL,{type:'inspect'});
  state=toolReducer(state,{type:'approve'});
  assert.equal(state.receipt,null);
  state=toolReducer(state,{type:'result',success:false});
  assert.equal(state.phase,'failed');
  assert.equal(state.receipt,null);
  assert.strictEqual(toolReducer(state,{type:'result',success:true}),state);
  state=toolReducer(state,{type:'reset'});
  state=toolReducer(state,{type:'inspect'});
  state=toolReducer(state,{type:'approve'});
  state=toolReducer(state,{type:'result',success:true});
  assert.equal(state.phase,'complete');
  assert.equal(state.receipt,'DRAFT-204');
});

test('all narration takes have real audio and changing script or delivery invalidates the rendered take',()=>{
  const metadata=require('../lib/data/ai-audio.json');
  for(const script of ['original','revised'])for(const pace of ['measured','brisk']){
    const settings={script,pace},key=takeKey(settings);
    assert.equal(takeCurrent(settings,key),true);
    assert.equal(takeCurrent({...settings,pace:pace==='measured'?'brisk':'measured'},key),false);
    assert.equal(takeCurrent({...settings,script:script==='original'?'revised':'original'},key),false);
  }
  for(const [key,clip] of Object.entries(metadata)){
    assert.ok(clip.duration>1&&clip.duration<30,key);
    assert.equal(clip.peaks.length,48);
    assert.ok(clip.peaks.some(x=>x>0));
    assert.ok(clip.peaks.every(x=>x>=0&&x<=100));
    assert.ok(fs.statSync(`public/audio/company-studies/${key}.mp3`).size>20000,key);
  }
  assert.equal(Object.keys(metadata).length,6);
});

test('dubbing acceptance needs explicit review of both versions and a new language clears prior review',()=>{
  const initial=dubInitial();
  assert.equal(dubCanAccept(initial),false);
  const generated={...initial,generated:true};
  assert.equal(dubCanAccept({...generated,sourceReviewed:true}),false);
  assert.equal(dubCanAccept({...generated,targetReviewed:true}),false);
  const reviewed={...generated,sourceReviewed:true,targetReviewed:true};
  assert.equal(dubCanAccept(reviewed),true);
  assert.equal(dubCanAccept({...reviewed,verdict:'issue'}),false);
  assert.equal(dubCanAccept({...reviewed,verdict:'accepted'}),false);
  const changed=dubInitial('pl');
  assert.equal(changed.sourceReviewed,false);
  assert.equal(changed.targetReviewed,false);
  assert.equal(dubCanAccept(changed),false);
  const source=fs.readFileSync('components/studies/ai/elevenlabs-app.tsx','utf8');
  assert.doesNotMatch(source,/onEnded=/,'Playback completion must not be treated as review');
});

test('a voice-agent candidate cannot receive traffic on a stale or failed test run',()=>{
  assert.deepEqual(agentTestResults(false),[false,true,true]);
  assert.deepEqual(agentTestResults(true),[true,true,true]);
  for(const args of [[false,false,true],[true,false,true],[true,null,true],[true,true,false]])assert.equal(canReleaseAgent(...args),false);
  assert.equal(canReleaseAgent(true,true,true),true);
});

test('AI companies are unique Atlas members in valid AI categories, with their own rendered experiences',()=>{
  const {ALL_COMPANIES}=require('../lib/data/ecosystem.ts');
  const {SECTORS,CATEGORIES,CROSS_SECTOR}=require('../lib/data/atlas.ts');
  const scenes={anthropic:{cowork:'Prepare the Meridian renewal brief.',code:'Retry a timeout. Stop after the second attempt.',playground:'A tool request is not a tool result.'},openai:{work:'Turn the launch context into a decision document.',codex:'Delegate the attempt. Inspect what changed.',responses:'Prepare a refund draft. Do not refund the customer.'},elevenlabs:{studio:'Direct the take. Keep the script and audio together.',dubbing:'The message must survive the language change.',agents:'The caller changed the date. Did the tool call change?'}};
  assert.ok(SECTORS.some(x=>x.id==='ai'));
  for(const [id,screens] of Object.entries(scenes)){
    assert.equal(ALL_COMPANIES.filter(x=>x.slug===id).length,1);
    assert.equal(CROSS_SECTOR[id].sector,'ai');
    assert.ok(CATEGORIES.some(x=>x.id===CROSS_SECTOR[id].category&&x.sector==='ai'));
    for(const [screen,title] of Object.entries(screens)){
      const html=fs.readFileSync(`.next/server/app/companies/${id}/app/${screen}.html`,'utf8');
      assert.ok(html.includes(`data-ai-company="${id}"`));
      assert.ok(html.includes(title));
      assert.ok(html.includes(`/companies/${id}/backstage/sources`));
    }
  }
});
