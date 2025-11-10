import {create} from 'zustand';

import {IAIResponseClass} from '../chat/helper';

interface AIStore {
  listAIResponse: IAIResponseClass[];
  setListAIResponse: (listAIResponse: IAIResponseClass[]) => void;
  addListAIResponse: (listAIResponse: IAIResponseClass) => void;
  getListAIResponse: () => IAIResponseClass[];
}

const initialSettingState = {
  listAIResponse: [],
};

export const useAIStore = create<AIStore>((set, get) => ({
  ...initialSettingState,
  setListAIResponse: (listAIResponse: IAIResponseClass[]) => {
    set({listAIResponse});
  },
  addListAIResponse: (listAIResponse: IAIResponseClass) => {
    const newListAIResponse = [...get().listAIResponse, listAIResponse];
    set({listAIResponse: newListAIResponse});
  },
  getListAIResponse: () => {
    return get().listAIResponse;
  },
}));
