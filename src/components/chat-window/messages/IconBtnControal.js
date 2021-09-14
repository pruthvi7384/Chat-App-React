import React from 'react'
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite'

const ConditionalBtch = ({condition, children})=>{
    return condition ? <Badge content={condition}>{children}</Badge> : children;
}

function IconBtnControal({
    isVisible,
    iconName,
    tooltip,
    onClick,
    badgeContent,
    ...props
}) {
    return (
        <div className="ml-2" style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            <ConditionalBtch condition={badgeContent}>
                <Whisper placement="top" delay={0} delayHide={0} delayShow={0} trigger="hover" speaker={
                    <Tooltip>{tooltip}</Tooltip>
                }>
                    <IconButton {...props} onClick={onClick} circle size="xs" icon={<Icon icon={iconName} />} />
                </Whisper>
            </ConditionalBtch>
        </div>
    )
}

export default IconBtnControal
