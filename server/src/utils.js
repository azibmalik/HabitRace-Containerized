export function todayISO(){const d=new Date();return d.toISOString().slice(0,10)}
export function dateToISO(d){return d.toISOString().slice(0,10)}
export function isoAddDays(iso,delta){const d=new Date(iso);d.setUTCDate(d.getUTCDate()+delta);return dateToISO(d)}
export function calcStreak(daysISO){if(!daysISO.length)return 0;const set=new Set(daysISO);let streak=0;let cursor=todayISO();while(set.has(cursor)){streak+=1;cursor=isoAddDays(cursor,-1)}return streak}
