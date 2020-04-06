import React, {useContext} from "react";

const UserStatusContext = React.createContext([null, () => {}]);

export default UserStatusContext;