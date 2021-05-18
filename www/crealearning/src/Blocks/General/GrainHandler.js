import React, { Fragment } from 'react'

//Utilitaires
import Button from '../../Components/formWidget/Button'
import Fields from '../../Components/formWidget/Fields'

//Style
import './GrainHandler.scss'

const GrainHandler = ({g, currentGrain, changeCurrentGrain, onDoubleClickName, addNote, t, deleteGrain, duplicateGrain, showConfig, keyProps, right, lang}) => {
    return (
        <li keyProps={keyProps} className='grain__element' onClick={(event, index) => `${keyProps !== currentGrain ? changeCurrentGrain(event, keyProps) : ''}`}>
            <ul>
                {
                    right !== undefined ?
                    <li>
                        <a href={`/training/preview/${window.btoa(right.id_training + '&' + g.position)}`} target='_blank' rel='noopener noreferrer'>
                            <Button 
                                className='btn__grain btn__preview'
                                buttonTitle='_PREVIEW'
                                buttonText='_PREVIEW'
                                buttonType='button'
                            />
                        </a>
                    </li>
                    :
                    <Fragment/>
                }
                {
                    right !== undefined && right.is_editor ?
                    <Fragment>
                        <li>
                            <Button
                                className='btn__grain btn__duplicate'
                                buttonTitle='_DUPLICATE'
                                buttonText='_DUPLICATE'
                                buttonType='button'
                                onClick={(event, id) => duplicateGrain(event, g.id)}
                            />
                        </li>
                        <li>
                            <Button
                                className='btn__grain btn__configure'
                                buttonTitle='_SET'
                                buttonText='_SET'
                                buttonType='button'
                                onClick={(event) => showConfig()}
                            />
                        </li>
                        <li>
                            <Button 
                                className='btn__grain btn__delete'
                                buttonTitle='_DELETE' 
                                buttonText='_DELETE' 
                                buttonType='button' 
                                onClick={(event, id) => deleteGrain(event, g.id)}
                            />
                        </li>
                    </Fragment>
                    :
                    <Fragment/>
                }
            </ul>
            <ul className={`${keyProps === currentGrain ? 'selected' : ''}`}>
                <p className="p__name_grain" onDoubleClick={() => onDoubleClickName()}>{keyProps + 1 + ' - ' + `${g.name[lang] !== undefined ? g.name[lang] : g.name.slice(0,1)}`} </p>
                <li>
                    {
                        g.note_count === 0 ?
                        <Button
                            className='btn__notes'
                            buttonType='button'
                            buttonTitle='_GRAIN_EDIT_NOTE'
                            buttonText='_GRAIN_NO_NOTE'
                            onClick={() => addNote()}
                        /> 
                        : g.note_count === 1 ?
                        <Button
                            className='btn__notes__selected'
                            buttonType='button'
                            buttonTitle='_GRAIN_EDIT_NOTE'
                            buttonText={g.note_count + ' note'}
                            onClick={() => addNote()}
                        /> 
                        :
                        <Button
                            className='btn__notes__selected'
                            buttonType='button'
                            buttonTitle='_GRAIN_EDIT_NOTE'
                            buttonText={g.note_count + ' notes'}
                            onClick={() => addNote()}
                        /> 
                    }
                </li>
            </ul>
        </li>
    );
};

export default GrainHandler