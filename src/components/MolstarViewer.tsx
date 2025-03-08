import { useEffect, useRef, useState } from 'react';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';

declare global {
  interface Window {
    molstar?: PluginUIContext;
  }
}

interface MolstarViewerProps {
  pdbFilePath: string;
  mol2FilePath: string;
  width?: string;
  height?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const MolstarViewer: React.FC<MolstarViewerProps> = ({ 
  pdbFilePath, 
  mol2FilePath,
  width = '100%',
  height = '500px',
  onFullscreenChange
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const newFullscreenState = document.fullscreenElement !== null;
      setIsFullscreen(newFullscreenState);
      if (onFullscreenChange) {
        onFullscreenChange(newFullscreenState);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onFullscreenChange]);

  useEffect(() => {
    const initMolstar = async () => {
      if (!parentRef.current) return;

      const MySpec: PluginUISpec = {
        ...DefaultPluginUISpec(),
        layout: {
          initial: {
            isExpanded: false, // 初始不打开全屏模式
            showControls: false, // 初始不显示详细菜单
            controlsDisplay: 'reactive',
          }
        },
        components: {
          ...DefaultPluginUISpec().components,
          remoteState: 'none'
        }
      };

      window.molstar = await createPluginUI({
        target: parentRef.current,
        spec: MySpec,
        render: renderReact18
      });

      try {
        // 加载 PDB 文件
        const pdbData = await window.molstar.builders.data.download(
          { url: pdbFilePath },
          { state: { isGhost: true } }
        );
        const pdbTrajectory = await window.molstar.builders.structure.parseTrajectory(pdbData, 'pdb');
        await window.molstar.builders.structure.hierarchy.applyPreset(pdbTrajectory, 'default');

        // 加载 MOL2 文件
        const mol2Data = await window.molstar.builders.data.download(
          { url: mol2FilePath },
          { state: { isGhost: true } }
        );
        const mol2Trajectory = await window.molstar.builders.structure.parseTrajectory(mol2Data, 'mol2');
        await window.molstar.builders.structure.hierarchy.applyPreset(mol2Trajectory, 'default');
      } catch (error) {
        console.error('Failed to load structures:', error);
      }
    };

    initMolstar();

    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
    };
  }, [pdbFilePath, mol2FilePath]);

  return (
    <div 
      ref={parentRef} 
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #ccc',
        borderRadius: isFullscreen ? '0' : '8px'
      }} 
    />
  );
};

export default MolstarViewer; 