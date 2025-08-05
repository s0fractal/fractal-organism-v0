// 🧬 Genetic Drift Engine
// Evolves organisms based on usage patterns and ecosystem feedback

interface UsagePattern {
  event: string;
  frequency: number;
  success_rate: number;
  resonance_impact: number;
  timestamp: number;
}

interface Mutation {
  type: 'add_event' | 'modify_state' | 'alter_behavior' | 'visual_change';
  target: string;
  value: any;
  strength: number;
  color: string;
}

interface EcosystemFeedback {
  interactions: number;
  resonance_received: number;
  clones_spawned: number;
  mutations_survived: number;
  energy_flow: number;
}

export class GeneticDriftEngine {
  private readonly DRIFT_THRESHOLD = 0.7;
  private readonly MUTATION_RATE = 0.1;
  private readonly LEARNING_RATE = 0.05;
  
  analyzeUsagePatterns(patterns: UsagePattern[]): {
    dominant: string[];
    recessive: string[];
    emerging: string[];
  } {
    // Sort by frequency * success_rate
    const scored = patterns.map(p => ({
      event: p.event,
      score: p.frequency * p.success_rate * p.resonance_impact,
      recency: Date.now() - p.timestamp
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    // Categorize patterns
    const dominant = scored
      .filter(p => p.score > 0.8)
      .map(p => p.event);
      
    const recessive = scored
      .filter(p => p.score < 0.3)
      .map(p => p.event);
      
    const emerging = scored
      .filter(p => p.score > 0.5 && p.recency < 3600000) // Last hour
      .map(p => p.event);
    
    return { dominant, recessive, emerging };
  }
  
  generateDriftMutations(
    patterns: UsagePattern[],
    feedback: EcosystemFeedback
  ): Mutation[] {
    const mutations: Mutation[] = [];
    const analysis = this.analyzeUsagePatterns(patterns);
    
    // Strengthen dominant patterns
    analysis.dominant.forEach(event => {
      if (Math.random() < this.MUTATION_RATE * 2) {
        mutations.push({
          type: 'modify_state',
          target: `behaviors.${event}.efficiency`,
          value: 1.1, // 10% boost
          strength: 0.8,
          color: 'hsl(120, 70%, 50%)' // Green
        });
      }
    });
    
    // Prune recessive patterns
    analysis.recessive.forEach(event => {
      if (Math.random() < this.MUTATION_RATE) {
        mutations.push({
          type: 'alter_behavior',
          target: `behaviors.${event}`,
          value: 'deprecate',
          strength: 0.3,
          color: 'hsl(0, 70%, 50%)' // Red
        });
      }
    });
    
    // Experiment with emerging patterns
    analysis.emerging.forEach(event => {
      if (Math.random() < this.MUTATION_RATE * 1.5) {
        mutations.push({
          type: 'add_event',
          target: 'manifest.events',
          value: `${event}_enhanced`,
          strength: 0.6,
          color: 'hsl(60, 70%, 50%)' // Yellow
        });
      }
    });
    
    // Ecosystem-driven mutations
    if (feedback.resonance_received > 0.8) {
      // High resonance - amplify current form
      mutations.push({
        type: 'visual_change',
        target: 'svg.glow',
        value: true,
        strength: 0.9,
        color: 'hsl(180, 70%, 50%)' // Cyan
      });
    }
    
    if (feedback.energy_flow < 0.3) {
      // Low energy - seek new sources
      mutations.push({
        type: 'add_event',
        target: 'behaviors',
        value: 'seekEnergy',
        strength: 0.7,
        color: 'hsl(280, 70%, 50%)' // Purple
      });
    }
    
    if (feedback.clones_spawned > 3) {
      // Successful replication - enhance fertility
      mutations.push({
        type: 'modify_state',
        target: 'replication.rate',
        value: 1.2,
        strength: 0.8,
        color: 'hsl(200, 70%, 50%)' // Blue
      });
    }
    
    return mutations;
  }
  
  calculateDriftVector(
    current: any,
    mutations: Mutation[]
  ): {
    direction: number[];
    magnitude: number;
  } {
    // Convert mutations to a directional vector
    const vector = mutations.reduce((acc, mut) => {
      const dimension = this.mutationToDimension(mut);
      acc[dimension] = (acc[dimension] || 0) + mut.strength;
      return acc;
    }, {} as Record<number, number>);
    
    const direction = Object.values(vector);
    const magnitude = Math.sqrt(
      direction.reduce((sum, val) => sum + val * val, 0)
    );
    
    return { direction, magnitude };
  }
  
  applyGeneticDrift(
    organism: any,
    patterns: UsagePattern[],
    feedback: EcosystemFeedback
  ): {
    mutated: any;
    mutations: Mutation[];
    driftVector: any;
  } {
    const mutations = this.generateDriftMutations(patterns, feedback);
    const driftVector = this.calculateDriftVector(organism, mutations);
    
    // Only apply if drift exceeds threshold
    if (driftVector.magnitude < this.DRIFT_THRESHOLD) {
      return { mutated: organism, mutations: [], driftVector };
    }
    
    // Apply mutations
    const mutated = { ...organism };
    
    mutations.forEach(mutation => {
      this.applyMutation(mutated, mutation);
    });
    
    // Update generation and mutation history
    mutated.generation = (mutated.generation || 0) + 1;
    mutated.mutation_history = [
      ...(mutated.mutation_history || []),
      {
        timestamp: Date.now(),
        mutations: mutations.map(m => ({
          type: m.type,
          target: m.target,
          strength: m.strength
        })),
        vector: driftVector
      }
    ];
    
    return { mutated, mutations, driftVector };
  }
  
  private mutationToDimension(mutation: Mutation): number {
    // Map mutation types to vector dimensions
    const typeMap: Record<string, number> = {
      'add_event': 0,
      'modify_state': 1,
      'alter_behavior': 2,
      'visual_change': 3
    };
    
    const targetHash = this.hashString(mutation.target);
    
    return (typeMap[mutation.type] || 0) * 1000 + (targetHash % 1000);
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  private applyMutation(organism: any, mutation: Mutation): void {
    const path = mutation.target.split('.');
    let current = organism;
    
    // Navigate to target
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    // Apply mutation
    const key = path[path.length - 1];
    
    switch (mutation.type) {
      case 'add_event':
        if (Array.isArray(current[key])) {
          current[key].push(mutation.value);
        } else {
          current[key] = [mutation.value];
        }
        break;
        
      case 'modify_state':
        if (typeof current[key] === 'number') {
          current[key] *= mutation.value;
        } else {
          current[key] = mutation.value;
        }
        break;
        
      case 'alter_behavior':
        current[key] = mutation.value;
        break;
        
      case 'visual_change':
        current[key] = mutation.value;
        break;
    }
    
    // Track mutation in state
    if (!organism.state) organism.state = {};
    if (!organism.state.mutations) organism.state.mutations = [];
    
    organism.state.mutations.push({
      color: mutation.color,
      strength: mutation.strength,
      type: mutation.type,
      timestamp: Date.now()
    });
  }
  
  // Fitness evaluation
  evaluateFitness(
    organism: any,
    patterns: UsagePattern[],
    feedback: EcosystemFeedback
  ): number {
    let fitness = 0;
    
    // Base fitness from successful patterns
    const successRate = patterns.reduce((sum, p) => sum + p.success_rate, 0) / patterns.length;
    fitness += successRate * 0.3;
    
    // Ecosystem integration
    fitness += Math.min(feedback.resonance_received, 1) * 0.3;
    
    // Replication success
    fitness += Math.min(feedback.clones_spawned / 10, 1) * 0.2;
    
    // Energy efficiency
    fitness += Math.min(feedback.energy_flow, 1) * 0.2;
    
    return fitness;
  }
}

// Export singleton instance
export const geneticDrift = new GeneticDriftEngine();