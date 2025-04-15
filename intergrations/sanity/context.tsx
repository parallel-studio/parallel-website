'use client'

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

// Définition du type pour les données Sanity
export interface SanityData {
  header?: any
  footer?: any
  [key: string]: any // Permet d'ajouter d'autres propriétés à l'avenir
}

// Type pour le contexte avec les méthodes pour mettre à jour les données
interface SanityContextType {
  data: SanityData
  updateData: (newData: Partial<SanityData>) => void
}

// Valeur par défaut du contexte
const defaultContextValue: SanityContextType = {
  data: {},
  updateData: () => {},
}

export const SanityContext =
  createContext<SanityContextType>(defaultContextValue)

export function useSanityContext() {
  return useContext(SanityContext)
}

type SanityContextProviderProps = {
  data: Partial<SanityData>
}

export function SanityContextProvider({
  data,
  children,
}: PropsWithChildren<SanityContextProviderProps>) {
  const [allData, setAllData] = useState<SanityData>(data as SanityData)

  // Fonction pour mettre à jour les données
  const updateData = (newData: Partial<SanityData>) => {
    setAllData((prevData) => ({
      ...prevData,
      ...newData,
    }))
  }

  return (
    <SanityContext.Provider value={{ data: allData, updateData }}>
      {children}
    </SanityContext.Provider>
  )
}
