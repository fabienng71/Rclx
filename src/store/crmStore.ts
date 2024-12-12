import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tool, Activity, Sample, File, Folder } from '../types/crm';
import { saveActivity } from '../services/activities';

interface CRMStore {
  tools: Tool[];
  activities: Activity[];
  samples: Sample[];
  files: File[];
  folders: Folder[];
  addTool: (tool: Tool) => void;
  removeTool: (id: string) => void;
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  addSample: (sample: Sample) => void;
  updateSample: (id: string, updates: Partial<Sample>) => Promise<void>;
  addFile: (file: File) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  addFolder: (folder: Folder) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;
}

export const useCRMStore = create<CRMStore>()(
  persist(
    (set, get) => ({
      tools: [],
      activities: [],
      samples: [],
      files: [],
      folders: [
        {
          id: 'root',
          name: 'Root',
          parentId: null,
          createdBy: 'System',
          createdAt: new Date().toISOString(),
        }
      ],
      addTool: (tool) =>
        set((state) => ({ tools: [...state.tools, tool] })),
      removeTool: (id) =>
        set((state) => ({
          tools: state.tools.filter((tool) => tool.id !== id),
        })),
      addActivity: (activity) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
          // Also remove associated samples
          samples: state.samples.filter(sample => !sample.notes.includes(id))
        })),
      updateActivity: async (id, updates) => {
        const state = get();
        const activity = state.activities.find(a => a.id === id);
        if (!activity) return;

        // Create updated activity
        const updatedActivity = { ...activity, ...updates };

        // Save to backend
        await saveActivity(updatedActivity);

        // Update activity in store
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, ...updates } : activity
          ),
        }));

        // If status was updated, update linked samples
        if (updates.status) {
          const linkedSamples = state.samples.filter(sample => 
            sample.notes.includes(id)
          );

          // Update each linked sample
          linkedSamples.forEach(async (sample) => {
            await get().updateSample(sample.id, { status: updates.status });
          });
        }
      },
      addSample: (sample) =>
        set((state) => ({ samples: [...state.samples, sample] })),
      updateSample: async (id, updates) => {
        const state = get();
        const sample = state.samples.find(s => s.id === id);
        if (!sample) return;

        // Update sample in store
        set((state) => ({
          samples: state.samples.map((sample) =>
            sample.id === id ? { ...sample, ...updates } : sample
          ),
        }));

        // If status was updated, update linked activity
        if (updates.status) {
          // Extract activity ID from notes
          const activityId = sample.notes.match(/activity: ([a-zA-Z0-9-]+)/)?.[1];
          if (activityId) {
            const activity = state.activities.find(a => a.id === activityId);
            if (activity && activity.status !== updates.status) {
              await get().updateActivity(activityId, { status: updates.status });
            }
          }
        }
      },
      addFile: (file) =>
        set((state) => ({ files: [...state.files, file] })),
      deleteFile: (id) =>
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
        })),
      renameFile: (id, newName) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, name: newName } : file
          ),
        })),
      addFolder: (folder) =>
        set((state) => ({ folders: [...state.folders, folder] })),
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
        })),
      renameFolder: (id, newName) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name: newName } : folder
          ),
        })),
    }),
    {
      name: 'crm-storage',
      partialize: (state) => ({
        activities: state.activities,
        samples: state.samples,
        files: state.files,
        folders: state.folders,
      }),
    }
  )
);