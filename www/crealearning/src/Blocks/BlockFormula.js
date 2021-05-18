import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Global
import BlockSkeleton from './BlockSkeleton'
import OptionsHelp from './General/OptionsHelp'

//Utilitaires
import Button from './../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'

//Formula
import FormulaModal from '../Components/modal/FormulaModal'

class BlockFormula extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            modal: false,
            non_register: true,
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            type: '_FORMULA',
            options: {
                img: '',
                xmlOpenMath: '<OMOBJ xmlns=3"http://www.openmath.org/OpenMath" version="2.0" cdbase="http://www.openmath.org/cd"></OMOBJ>',
                legend: '',
                similar: false
            },
        }
    }

    componentDidMount(){
        super.componentDidMount()
        if (this.props.id_block !== undefined)
        {
            this.getBlockContent()
        }
        else{
            this.sendBlockToBack()
        }
    }

    openModalFormula(){
        const script = document.createElement('script')
        script.src = '/formulaeditor/org/mathdox/formulaeditor/main.js'
        script.async = true
        document.body.appendChild(script)
        this.setState({modal: true})
    }

    closeModalFormula(){
        let allScript = document.getElementsByTagName('script')
        let regexMainJs = /^.*?\b(formulaeditor)\b.*$/
        for (let i = 0; i < allScript.length; i++)
        {
            let script = allScript[i]
            if (regexMainJs.test(script.src))
            {
                document.body.removeChild(script)
            }
        }
        this.setState({modal: false})
    }

    annulModalFormula(annulationMessage){
        let textarea = document.getElementById('mathdoxtextarea');
        if (textarea.value !== this.state.options.xmlOpenMath && window.confirm(annulationMessage))
        {
            this.closeModalFormula()
        }
        else if(textarea.value === this.state.options.xmlOpenMath)
        {
            this.closeModalFormula()
        }
    }
    
    okModalFormula(_FORMULA_ERROR){
        let {options} = this.state;
        let textarea = document.getElementById('mathdoxtextarea');
        let canvas = document.getElementsByClassName('mathdoxformula')[0]
        let regex = /^.*?\b(invalid expression entered. Presentation was)\b.*$/
        
        if (regex.test(textarea.value)){
            if (window.confirm(_FORMULA_ERROR)){
                options.xmlOpenMath = textarea.value
                options.img = canvas.toDataURL('image/png')
                this.setState({options})
                this.closeModalFormula()
                this.sendBlockToBack()
                window.location.reload()
            }
        } else {

            options.xmlOpenMath = textarea.value
            options.img = canvas.toDataURL('image/png')

            this.setState({options})
            this.closeModalFormula()
            this.sendBlockToBack()
            window.location.reload()
        }
    }

    Content = () => {
        return(
            <Fragment>
                {
                    this.state.modal ? <FormulaModal code={this.state.options.xmlOpenMath} onAnnul={(_CANCEL_MESSAGE) => this.annulModalFormula(_CANCEL_MESSAGE)} onOk={(_FORMULA_ERROR) => this.okModalFormula(_FORMULA_ERROR)} /> : <Fragment />
                }
                <ul className='content-list'>
                    <li className='content-element'>
                        <Button
                            className='formula__btn'
                            buttonType='button'
                            onClick={() => this.openModalFormula()}
                            buttonTitle=''
                            buttonText='_FORMULA_OPEN'
                        />
                    </li>
                </ul>
            </Fragment>
        )
    }

    Options = () => {
        return(
            <ul className='checkbox-section'> 
                <Fields liClass='option-element' htmlFor='description' text='_DESCRIPTION' inputType='text'/>
            </ul>
        )
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_FORMULA')}</h3>
                        <p>{t('_FORMULA_HELP_1')}</p>
                        <OptionsHelp>
                            <ul>
                                <li><b>{t('_DESCRITPION')}</b>{t('_FORMULA_HELP_2')}</li>
                            </ul>
                            <p>{t('_FORMULA_HELP_3')}</p>
                        </OptionsHelp>
                    </Fragment>
                }
            </Translation>
        )
    }

    render(){
        return(
                super.render()
            )
        }
    }

export default BlockFormula