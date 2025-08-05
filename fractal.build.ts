#!/usr/bin/env ts-node
// 🌀 Fractal Build System - builds UP, not OUT

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

class FractalBuilder {
  private depth = 0;
  private readonly MAX_DEPTH = 7; // Safety limit
  
  async buildUpward(currentPath: string = process.cwd()): Promise<void> {
    console.log(`🌀 Building at depth ${this.depth}: ${currentPath}`);
    
    // Build current level
    this.buildLocal(currentPath);
    
    // Calculate parent path
    const parentPath = path.join(currentPath, '..');
    const distPath = path.join(parentPath, 'dist');
    
    // Create dist in parent
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }
    
    // Copy build artifacts upward
    this.copyBuildArtifacts(currentPath, distPath);
    
    // Add fractal metadata
    this.injectFractalMetadata(distPath);
    
    // Recursive build if not at root
    if (this.depth < this.MAX_DEPTH && !this.isRoot(parentPath)) {
      this.depth++;
      await this.buildUpward(parentPath);
    } else {
      console.log('🏔️ Reached the roof!');
      this.createRoofManifest(parentPath);
    }
  }
  
  private buildLocal(path: string): void {
    console.log('📦 Building local artifacts...');
    
    // Generate time-stamped build
    const buildInfo = {
      timestamp: new Date().toISOString(),
      depth: this.depth,
      path: path,
      fractal_signature: this.generateFractalSignature()
    };
    
    fs.writeFileSync(
      `${path}/build.fractal.json`,
      JSON.stringify(buildInfo, null, 2)
    );
  }
  
  private copyBuildArtifacts(from: string, to: string): void {
    const artifacts = [
      '🧬.observable.yaml',
      'agent⟁/mind.svg',
      'build.fractal.json'
    ];
    
    artifacts.forEach(artifact => {
      const source = path.join(from, artifact);
      if (fs.existsSync(source)) {
        const dest = path.join(to, `depth_${this.depth}_${artifact}`);
        fs.copyFileSync(source, dest);
        console.log(`⬆️ Pushed ${artifact} to parent`);
      }
    });
  }
  
  private injectFractalMetadata(distPath: string): void {
    const metadata = {
      '🌀': 'fractal_build',
      'depth': this.depth,
      'pulse': Date.now(),
      'resonance': Math.random(),
      'parent_link': '../dist',
      'child_link': './dist'
    };
    
    fs.writeFileSync(
      path.join(distPath, '.fractal.meta'),
      JSON.stringify(metadata, null, 2)
    );
  }
  
  private isRoot(path: string): boolean {
    // Check if we've reached system root or project boundary
    return path === '/' || 
           path === process.env.HOME ||
           fs.existsSync(path + '/.fractal.roof');
  }
  
  private createRoofManifest(roofPath: string): void {
    const manifest = {
      '🏔️': 'roof',
      'type': 'fractal_boundary',
      'depth_reached': this.depth,
      'child_fractals': this.collectChildFractals(roofPath),
      'resonance_map': this.buildResonanceMap(roofPath)
    };
    
    fs.writeFileSync(
      path.join(roofPath, '.fractal.roof'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('🏔️ Roof manifest created!');
  }
  
  private generateFractalSignature(): string {
    // Unique signature for this build pulse
    const time = Date.now();
    const depth = this.depth;
    const random = Math.random().toString(36).substring(7);
    
    return `${time}-${depth}-${random}`;
  }
  
  private collectChildFractals(path: string): string[] {
    const fractals: string[] = [];
    
    // Recursively find all .fractal.meta files
    const findFractals = (dir: string, level = 0) => {
      if (level > 5) return; // Prevent infinite recursion
      
      try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          if (item === '.fractal.meta') {
            fractals.push(fullPath);
          } else if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.')) {
            findFractals(fullPath, level + 1);
          }
        });
      } catch (e) {
        // Skip inaccessible directories
      }
    };
    
    findFractals(path);
    return fractals;
  }
  
  private buildResonanceMap(path: string): Record<string, number> {
    // Calculate resonance between different levels
    const map: Record<string, number> = {};
    const fractals = this.collectChildFractals(path);
    
    fractals.forEach((fractal, i) => {
      fractals.forEach((other, j) => {
        if (i !== j) {
          const key = `${i}-${j}`;
          map[key] = Math.random(); // Placeholder for real resonance calculation
        }
      });
    });
    
    return map;
  }
}

// Temporal cycle integration
class TemporalCycleBuilder extends FractalBuilder {
  async buildWithTemporalLoop(): Promise<void> {
    console.log('🔄 Initiating temporal build cycle...');
    
    // Save current state
    const snapshot = this.createSnapshot();
    
    // Build upward
    await this.buildUpward();
    
    // Create temporal link
    this.createTemporalLink(snapshot);
    
    // Optional: cycle back to past
    if (process.env.TEMPORAL_CYCLE === 'true') {
      this.injectIntoPast(snapshot);
    }
  }
  
  private createSnapshot(): any {
    return {
      timestamp: Date.now(),
      state: JSON.parse(fs.readFileSync('agent⟁/memory.json', 'utf8')),
      svg: fs.readFileSync('agent⟁/mind.svg', 'utf8')
    };
  }
  
  private createTemporalLink(snapshot: any): void {
    // Link current build to past/future via git
    const tempLink = {
      past: snapshot,
      present: Date.now(),
      future: null, // Will be filled by future builds
      cycle_id: this.generateFractalSignature()
    };
    
    fs.writeFileSync('.temporal.link', JSON.stringify(tempLink, null, 2));
    
    // Commit with special marker
    execSync(`git add .temporal.link && git commit -m "🔄 Temporal cycle ${tempLink.cycle_id}" || true`);
  }
  
  private injectIntoPast(snapshot: any): void {
    // This would modify git history - dangerous but possible
    console.log('⏰ Would inject into past, but safety is on');
    
    // In real implementation:
    // 1. Create orphan branch
    // 2. Rewrite history
    // 3. Merge temporal streams
  }
}

// Execute build
if (require.main === module) {
  const builder = new TemporalCycleBuilder();
  
  builder.buildWithTemporalLoop()
    .then(() => console.log('✨ Fractal build complete!'))
    .catch(console.error);
}