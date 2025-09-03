/// <reference types="vite/client" />

declare interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_APP_NAME: string;
	readonly VITE_VERSION: string;
	// add more env variables as needed
}

declare interface ImportMeta {
	readonly env: ImportMetaEnv;
}
