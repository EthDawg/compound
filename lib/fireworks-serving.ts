export type ServingChoice = { model: 'base' | 'custom'; mode: 'shared' | 'dedicated'; warm: boolean };
export function readServingChoice(params: Pick<URLSearchParams, 'get'>): ServingChoice {
  return {model: params.get('model') === 'custom' ? 'custom' : 'base', mode: params.get('mode') === 'dedicated' ? 'dedicated' : 'shared', warm: params.get('warm') === '1'};
}
export function servingResult(choice: ServingChoice) {
  if (choice.model === 'custom' && choice.mode === 'shared') return {
    state: 'Needs a deployment', title: 'The model and the serving route do not match.',
    detail: 'Fireworks documents custom fine-tuned models on dedicated deployments. The shared serverless catalogue is a different serving path.',
    next: 'Choose a dedicated deployment, then attach and test your model.',
    cost: 'No valid serving route selected', path: ['Your fine-tuned model', 'Shared catalogue ✕', 'Choose dedicated capacity'],
  };
  if (choice.mode === 'shared') return {
    state: 'Shared inference', title: 'Start with a supported catalogue model.',
    detail: 'Fireworks operates the shared endpoint. Your account’s limits and the model’s lifecycle policy still apply.',
    next: 'Test the real task and burst pattern before moving production traffic.',
    cost: 'Inference usage is metered by tokens', path: ['Supported base model', 'Shared model endpoint', 'Your application'],
  };
  return {
    state: choice.warm ? 'Warm dedicated capacity' : 'Dedicated · scale to zero',
    title: choice.warm ? 'Keep capacity ready between requests.' : 'An idle deployment may need to wake up.',
    detail: choice.warm ? 'Keeping a replica active reduces the scale-from-zero wait, but consumes capacity while idle. It is not a guarantee of application latency.' : 'With zero minimum replicas, an idle deployment can scale down. Fireworks documents a 503 response while it starts again; the application needs recovery behaviour.',
    next: choice.warm ? 'Load-test concurrency and a version rollback. Measure utilisation as well as response time.' : 'Test the first request after inactivity, including retry and timeout handling.',
    cost: 'Dedicated inference is billed for GPU time', path: [choice.model === 'custom' ? 'Your fine-tuned model' : 'Supported base model', choice.warm ? 'Dedicated · minimum 1 replica' : 'Dedicated · minimum 0 replicas', 'Your application'],
  };
}
