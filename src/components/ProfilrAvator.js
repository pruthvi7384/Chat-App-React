import React from 'react'
import { Avatar } from 'rsuite'
import { getNameIntial } from '../misc/helper'

function ProfilrAvator({name,...avatarProps}) {
    return (
        <Avatar circle {...avatarProps}>
            { getNameIntial(name) }
        </Avatar>
    )
}

export default ProfilrAvator
