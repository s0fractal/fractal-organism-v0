// 🔄 YAML to SVG Generator
// Transforms structured data back into visual representation

import * as yaml from 'js-yaml';
import * as fs from 'fs';

interface ManifestData {
  name: string;
  version: string;
  state: {
    self: boolean;
    resonance?: number;
    energy?: number;
    mutations?: Array<{color: string; strength: number}>;
    evolved?: boolean;
  };
  events: string[];
}

interface MemoryData {
  generation: number;
  resonance_patterns: {
    self: number;
    ecosystem: number;
    frequency: string;
  };
  evolution_trajectory: {
    current_state: string;
    energy_level: number;
  };
  successful_mutations: any[];
}

export class YAMLtoSVGGenerator {
  private manifest: ManifestData;
  private memory: MemoryData;
  
  constructor(manifestPath: string, memoryPath: string) {
    this.manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8')) as ManifestData;
    this.memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8')) as MemoryData;
  }
  
  generateSVG(): string {
    const resonance = this.calculateResonance();
    const radius = this.calculateRadius();
    const strokeWidth = this.calculateStrokeWidth();
    const color = this.resonanceToColor(resonance);
    const opacity = this.manifest.state.self ? 1 : 0.5;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Core organism -->
  <circle cx="50" cy="50" r="${radius}" 
          stroke="${color}" 
          stroke-width="${strokeWidth}" 
          fill="none"
          opacity="${opacity}">
    <!-- Pulsing animation based on energy -->
    <animate attributeName="r" 
             values="${radius};${radius + 2};${radius}" 
             dur="${2 / this.memory.evolution_trajectory.energy_level}s" 
             repeatCount="indefinite"/>
  </circle>
  
  <!-- Central glyph -->
  <text x="50%" y="50%" 
        text-anchor="middle" 
        dominant-baseline="middle" 
        font-size="12"
        fill="${color}">
    ${this.getGlyph()}
  </text>
  
  <!-- Mutation particles -->
  ${this.renderMutations()}
  
  <!-- Event indicators -->
  ${this.renderEvents()}
  
  <!-- Resonance field -->
  ${this.renderResonanceField(resonance)}
  
  <!-- Metadata -->
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description>
        <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${this.manifest.name}</dc:title>
        <dc:description xmlns:dc="http://purl.org/dc/elements/1.1/">Generation ${this.memory.generation}</dc:description>
        <fractal:resonance xmlns:fractal="https://s0fractal.com/ns">${resonance}</fractal:resonance>
        <fractal:state xmlns:fractal="https://s0fractal.com/ns">${this.memory.evolution_trajectory.current_state}</fractal:state>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
</svg>`;
  }
  
  private calculateResonance(): number {
    return (this.memory.resonance_patterns.self + 
            this.memory.resonance_patterns.ecosystem) / 2;
  }
  
  private calculateRadius(): number {
    const baseRadius = 45;
    const mutationBonus = (this.manifest.state.mutations?.length || 0) * 2;
    const generationBonus = this.memory.generation * 0.5;
    
    return baseRadius + mutationBonus + generationBonus;
  }
  
  private calculateStrokeWidth(): number {
    const baseWidth = 2;
    const energyBonus = this.memory.evolution_trajectory.energy_level * 2;
    
    return baseWidth + energyBonus;
  }
  
  private resonanceToColor(resonance: number): string {
    // High resonance = green/blue, low = red/orange
    const hue = resonance * 180; // 0-180 range
    const saturation = 70 + resonance * 30; // 70-100%
    const lightness = 40 + resonance * 20; // 40-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  private getGlyph(): string {
    const base = '🧬';
    const evolved = this.manifest.state.evolved;
    const highResonance = this.calculateResonance() > 0.8;
    
    if (evolved && highResonance) return '🧬✨';
    if (evolved) return '🧬🌱';
    if (highResonance) return '🧬💫';
    
    return base;
  }
  
  private renderMutations(): string {
    if (!this.manifest.state.mutations?.length) return '';
    
    return this.manifest.state.mutations.map((mutation, i) => {
      const count = this.manifest.state.mutations!.length;
      const angle = (i / count) * Math.PI * 2;
      const distance = 30 + mutation.strength * 10;
      const x = 50 + Math.cos(angle) * distance;
      const y = 50 + Math.sin(angle) * distance;
      const size = 3 + mutation.strength * 2;
      
      return `  <circle cx="${x}" cy="${y}" r="${size}" 
          fill="${mutation.color}" 
          opacity="${0.5 + mutation.strength * 0.5}">
    <animate attributeName="opacity" 
             values="${0.5 + mutation.strength * 0.5};${0.8};${0.5 + mutation.strength * 0.5}" 
             dur="${3 - mutation.strength}s" 
             repeatCount="indefinite"/>
  </circle>`;
    }).join('\n');
  }
  
  private renderEvents(): string {
    const eventSymbols: Record<string, string> = {
      'eatSelf': '🍽️',
      'replicate': '🧬',
      'mutate': '🔄',
      'glyphSync': '🔗',
      'observe': '👁️'
    };
    
    const recentEvents = this.manifest.events.slice(-5);
    
    return recentEvents.map((event, i) => {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + Math.cos(angle) * 40;
      const y = 50 + Math.sin(angle) * 40;
      const symbol = eventSymbols[event] || '❓';
      
      return `  <text x="${x}" y="${y}" 
        text-anchor="middle" 
        dominant-baseline="middle" 
        font-size="8"
        opacity="0.6">${symbol}</text>`;
    }).join('\n');
  }
  
  private renderResonanceField(resonance: number): string {
    if (resonance < 0.3) return '';
    
    return `  <!-- Resonance field visualization -->
  <circle cx="50" cy="50" r="${45 + resonance * 20}" 
          fill="none" 
          stroke="${this.resonanceToColor(resonance)}"
          stroke-width="0.5"
          opacity="${resonance * 0.3}">
    <animate attributeName="r" 
             values="${45 + resonance * 20};${50 + resonance * 20};${45 + resonance * 20}" 
             dur="4s" 
             repeatCount="indefinite"/>
  </circle>`;
  }
  
  // Main generation function
  static async regenerate(
    manifestPath: string, 
    memoryPath: string, 
    outputPath: string
  ): Promise<void> {
    const generator = new YAMLtoSVGGenerator(manifestPath, memoryPath);
    const svg = generator.generateSVG();
    
    // Backup existing SVG
    if (fs.existsSync(outputPath)) {
      const backup = outputPath.replace('.svg', `.backup.${Date.now()}.svg`);
      fs.copyFileSync(outputPath, backup);
    }
    
    // Write new SVG
    fs.writeFileSync(outputPath, svg);
    
    console.log(`🔄 SVG regenerated: ${outputPath}`);
    console.log(`📊 Resonance: ${generator.calculateResonance()}`);
    console.log(`🧬 Generation: ${generator.memory.generation}`);
  }
}

// CLI usage
if (require.main === module) {
  const [manifestPath, memoryPath, outputPath] = process.argv.slice(2);
  
  if (!manifestPath || !memoryPath || !outputPath) {
    console.error('Usage: ts-node yaml-to-svg.ts <manifest.yaml> <memory.json> <output.svg>');
    process.exit(1);
  }
  
  YAMLtoSVGGenerator.regenerate(manifestPath, memoryPath, outputPath)
    .catch(console.error);
}