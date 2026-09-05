/**
 * Flip to `false` and redeploy to bring the tracker back online.
 * Or set Vercel env `VITE_SITE_SHUTDOWN=false` (overrides this default when set).
 */
const envFlag = import.meta.env.VITE_SITE_SHUTDOWN

export const SITE_SHUTDOWN: boolean =
  envFlag === undefined || envFlag === ''
    ? true
    : envFlag === '1' || envFlag.toLowerCase() === 'true'
