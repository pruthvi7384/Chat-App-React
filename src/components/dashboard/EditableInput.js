import React, {useState,useCallback} from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import InputGroupButton from 'rsuite/lib/InputGroup/InputGroupButton';

function EditableInput({initialvalue,onSave,label,placeholder='write your name',wrapperClassName="",emptyMessage='Input Is Empty',...inputProps}) {
    const [input, setInput] = useState(initialvalue);
    const [isEditable, setIsEditable] = useState(false);

    const onEditClick=useCallback(()=>{
        setIsEditable( p=>!p );
        setInput(initialvalue);
    },[initialvalue]);
    const onSaveClick = async ()=>{
        const trimmed = input.trim();
        if(trimmed === ''){
            Alert.info(emptyMessage,4000);
        }
        if(trimmed !== initialvalue){
            await onSave(trimmed);
        }
        setIsEditable(false);
    };
    return (
        <div className={wrapperClassName}>
            {label}
            <InputGroup>
                <Input {...inputProps} disabled={!isEditable} value={input}  onChange={value=>setInput(value)} />
                <InputGroupButton onClick={onEditClick}>
                    <Icon icon={isEditable ? 'close': 'edit2'}/>
                </InputGroupButton>
                {isEditable && (
                    <InputGroupButton onClick={onSaveClick}>
                        <Icon icon="check" />
                    </InputGroupButton>
                )}
            </InputGroup>
        </div>
    )
}

export default EditableInput
