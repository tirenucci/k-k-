import React, { Fragment } from 'react'

import Fields from '../../Components/formWidget/Fields'

const Options = ({children, checked, oncheck}) => {
    return(
        <Fragment>
            <Fields
                liClass='checkbox'
                inputType='checkbox'
                htmlFor='similar' 
                text='_SIMILAR'
                value={checked} 
                onChange={(event, target, checkbox) => oncheck(event, target, checkbox)}
            >
            </Fields>
            {children}
        </Fragment>
    )
}

export default Options