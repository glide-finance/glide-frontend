const ARCHIVED_FARMS_START_PID = 1000
const ARCHIVED_FARMS_END_PID = 2500

const isArchivedPid = (pid: number) => pid >= ARCHIVED_FARMS_START_PID && pid <= ARCHIVED_FARMS_END_PID

export default isArchivedPid
