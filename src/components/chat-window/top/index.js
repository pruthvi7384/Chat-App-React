import React,{ memo } from 'react'
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/CurrentRoomContext'
import { useMediaQuery } from '../../../misc/Custom-Hooks';
import EditRoomBtn from './EditRoomBtn';
import RoomInfoBtnModal from './RoomInfoBtnModal';

function Top() {
    const name = useCurrentRoom(v=>v.name);
    const isAdmin = useCurrentRoom(v=>v.isAdmin);
    const ismobile = useMediaQuery('(max-width:992px)');
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="text-disappear d-flex align-items-center">
                    <Icon
                            componentClass={Link}
                            to="/"
                            icon="arrow-circle-left"
                            sixe="2x"
                            className={
                                ismobile 
                                ? 'd-inline-block p-0 mr-2 link-unstyled'
                                : 'd-none'
                            }
                    />
                    <span className="text-disappear">{name}</span>
               </h4>
               <ButtonToolbar className="ws-nowrap">
                    {isAdmin && (<EditRoomBtn/>)}
               </ButtonToolbar>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                    <span>todo</span>
                    <RoomInfoBtnModal/>
            </div>
        </div>
    )
}

export default memo(Top)
