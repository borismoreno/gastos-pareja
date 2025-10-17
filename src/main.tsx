import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './router/AppRouter.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthContextProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <div className='flex flex-col lg:flex-row h-screen w-full bg-[#FFF5EB]'>
                        <AppRouter />
                    </div>
                </PersistGate>
            </Provider>
        </AuthContextProvider>
    </StrictMode>,
)
