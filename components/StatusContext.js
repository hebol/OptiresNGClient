import React, {useContext} from "react";

const StatusContext = React.createContext([null, () => {}]);

export default StatusContext;