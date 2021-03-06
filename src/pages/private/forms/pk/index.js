import React, { useState, useEffect, useRef } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

//icons
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import SaveIcon from '@material-ui/icons/Save';

import useStyles from './styles';

import { usePouchDB } from '../../../../components/PouchDB/PouchDBProvider';
import { useSnackbar } from 'notistack';

import { Swipeable } from 'react-swipeable';

import subforms from './questions.json';

// subforms
import SubFormRadio from './subforms/radio';
import SubFormNumber from './subforms/number';
import SubFormNumber26 from './subforms/number_26';
import SubformCheckbox from './subforms/checkbox';
import SubformCheckbox2 from './subforms/checkbox2';
import SubFormRadio2 from './subforms/subformradio';
import SubFormRadio18 from './subforms/subformradio_18';


import { countAge } from '../pk/validation';

function PK({ wilayah, keluarga, kb, pk, mainSlide, setPK, handleNext, handleBack, handleDraft, handleSegmen, setNormalizePK, mode, no_kk }) {

    const classes = useStyles();
    const nextRef = useRef(null);
    const backRef = useRef(null);

    const { user: { metadata } } = usePouchDB();
    const { enqueueSnackbar } = useSnackbar();
    const [subformIndex, setSubFormIndex] = useState(0)//set 0;
    const [slide, setSlide] = useState({
        direction: "left",
        in: true
    });
    const [isSomethingChange, setSomethingChange] = useState(false);

    const [isSubmitting, setSubmitting] = useState(false);

    const [isSaved, setSaved] = useState({
        local: false,
        remote: false
    })

    const [navigationMode, setNavigationMode] = useState('next');

    // By Me
    const [isSingle, setIsSingle] = useState(wilayah.jumlah_keluarga == "1");
    //



    useEffect(() => {

        let initialPK = {};
        const sfKeys = Object.keys(subforms);
        for (let i = 0; i < sfKeys.length; i++) {
            initialPK[`${sfKeys[i]}`] = {}
        }
        setPK(cpk => {
            if (Object.keys(cpk).length > 0) {
                return { ...initialPK, ...cpk };
            }

            return initialPK
        });

        setNormalizePK(cpk => {
            if (Object.keys(cpk).length > 0) {
                return { ...initialPK, ...cpk };
            }

            return initialPK
        })

        // By Me 
        // Kondisi ketika satu rumah hanya terdiri 1 orang
        //if (isSingle) {
        // let tgl_lahir = keluarga['01'].tgl_lahir
        // if (countAge(tgl_lahir) >= 60) {
        //     setSubFormIndex(16)
        // }
        //}
        //


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckSegmen = async (event) => {
        const { value } = event.target;
        console.log(wilayah.status_draft, "status_draft")
        // const x = Object.keys(keluarga).length;
        const x = parseInt(wilayah.jumlah_keluarga);
        console.log(x, 'jml kel')
        if (value) {
            let val = parseInt(value);
            console.log(val, 'val parseint')
            if (x > 1) {
                (val > 1) ? val = val + x - 1 : val = val
            }
            if (x == 1 && val == 2) {
                console.log("masuk if 1 2")
                alert("Data KB tidak tersedia");
            } else {
                console.log("masuk jmlklg" + x + "val" + val)
                handleSegmen(event, val)
            }
        }
    }

    const handleNextSub = () => {
        if (subformIndex >= 31 || (subformIndex === 30 && pk["0231"] && pk["0231"].jawaban === "2")) {
            return handleNext()
        }
        setNavigationMode('next')
        setSlide({
            direction: "right",
            in: false
        });
        setTimeout(() => {

            // if (isSingle) {
            //     let tgl_lahir = keluarga['01'].tgl_lahir
            //     if (countAge(tgl_lahir) >= 60) {
            //         if (subformIndex === 16) {
            //             setSubFormIndex(index => index + 2);
            //         } else {
            //             setSubFormIndex(index => index + 1);
            //         }
            //     } else {
            //         setSubFormIndex(index => index + 1);
            //     }
            // } else {
            //     setSubFormIndex(index => index + 1);
            // }

            // Sebatang Kara Mengisi PK No.1
            if (isSingle) {
                if (subformIndex === 0) {
                    setSubFormIndex(index => index + 3);
                } else if (subformIndex === 7) {
                    setSubFormIndex(index => index + 4);
                } else if (subformIndex === 11) {
                    setSubFormIndex(index => index + 4);
                } else {
                    setSubFormIndex(index => index + 1);
                }
            } else {
                setSubFormIndex(index => index + 1);
            }
            // Sebatang Kara Mengisi PK No.1

            setSlide({
                direction: "left",
                in: true
            })

        }, 300)

    }


    const handleBackSub = () => {


        if (subformIndex === 0) {
            return handleBack()
        }

        // By Me
        // if (isSingle) {
        //     let tgl_lahir = keluarga['01'].tgl_lahir
        //     if (countAge(tgl_lahir) >= 60) {
        //         if (subformIndex === 16) {
        //             return handleBack()
        //         }
        //     }
        // }
        //

        setNavigationMode('back')
        setSlide({
            direction: "left",
            in: false
        });
        setTimeout(() => {

            // if (isSingle) {
            //     let tgl_lahir = keluarga['01'].tgl_lahir
            //     if (countAge(tgl_lahir) >= 60) {
            //         if (subformIndex === 18) {
            //             setSubFormIndex(index => index - 2);
            //         } else {
            //             setSubFormIndex(index => index - 1);
            //         }
            //     } else {
            //         setSubFormIndex(index => index - 1);
            //     }
            // } else {
            //     setSubFormIndex(index => index - 1);
            // }

            // Sebatang Kara Mengisi PK No.1
            if (isSingle) {
                if (subformIndex === 3) {
                    setSubFormIndex(index => index - 3);
                } else if (subformIndex === 11) {
                    setSubFormIndex(index => index - 4);
                } else if (subformIndex === 15) {
                    setSubFormIndex(index => index - 4);
                } else {
                    setSubFormIndex(index => index - 1);
                }
            } else {
                setSubFormIndex(index => index - 1);
            }
            // Sebatang Kara Mengisi PK No.1

            setSlide({
                direction: "right",
                in: true
            })

        }, 300)
    }


    const no = Object.keys(subforms)[subformIndex];

    const setValue = (e) => {
        console.log(e.target.value, 'cekradio')
        console.log(no, 'no')

        if (no === '0229' && e.target.value === '2') {
            console.log('set30 NULL')
            const tempNo = Object.keys(subforms)[subformIndex + 1];
            console.log(tempNo, 'tempNo')
            setPK({
                ...pk,
                [no]: {
                    ...pk[no],
                    [e.target.name]: e.target.value
                },
                [tempNo]: {
                    ...pk[tempNo],
                    jawaban: []
                }
            })
        } else {
            setPK({
                ...pk,
                [no]: {
                    ...pk[no],
                    [e.target.name]: e.target.value
                }
            })
        }

        console.log(pk, 'pk')

        setSomethingChange(true)
    }

    const saveValue = async (normalizeValue) => {
        console.log(normalizeValue, "normalizeValue")
        const id = `${wilayah.no_kk}${no}`;
        if (!isSomethingChange) {
            if (no === '0229' && normalizeValue.Jawab_Pilih === '2') {
                const temp30 = Object.keys(subforms)[subformIndex + 1];
                setNormalizePK(normalizePK => ({
                    ...normalizePK,
                    [no]: {
                        ...normalizeValue,
                        _id: id,
                        No_KK: wilayah.no_kk,
                        Periode_Sensus: "2020",
                        user_name: metadata.name
                    },
                    [temp30]: {}
                }));
            } else {
                setNormalizePK(normalizePK => ({
                    ...normalizePK,
                    [no]: {
                        ...normalizeValue,
                        _id: id,
                        No_KK: wilayah.no_kk,
                        Periode_Sensus: "2020",
                        user_name: metadata.name
                    }
                }));
            }
            return handleNextSub();
        }
        //simpan ke db local
        setSubmitting(true);

        try {
            // const existing = await dataPK.local.get(id)

            // await dataPK.local.put({
            //     _id: id,
            //     _rev: existing._rev,
            //     ...normalizeValue
            // })
            if (no === '0229' && normalizeValue.Jawab_Pilih === '2') {
                const temp30 = Object.keys(subforms)[subformIndex + 1];
                setNormalizePK(normalizePK => ({
                    ...normalizePK,
                    [no]: {
                        ...normalizeValue,
                        _id: id,
                        No_KK: wilayah.no_kk,
                        Periode_Sensus: "2020",
                        user_name: metadata.name
                    },
                    [temp30]: {}
                }));
            } else {
                setNormalizePK(normalizePK => ({
                    ...normalizePK,
                    [no]: {
                        ...normalizeValue,
                        _id: id,
                        No_KK: wilayah.no_kk,
                        Periode_Sensus: "2020",
                        user_name: metadata.name
                    }
                }));
            }
            setSomethingChange(false);
            setSubmitting(false);
            handleNextSub()
        } catch (e) {
            setSubmitting(false);
            if (e.name === 'not_found') {
                try {
                    // await dataPK.local.put({
                    //     _id: id,
                    //     type: 'anggota',
                    //     ...normalizeValue
                    // })

                    setSomethingChange(false);
                    handleNextSub()
                } catch (e) {
                    enqueueSnackbar(e.message, { variant: 'error' })
                }
            } else {
                enqueueSnackbar(e.message, { variant: 'error' })
            }

        }
    }
    //console.log(subformIndex, no)

    const backRadio = (cekberlaku) => {
        if (cekberlaku === false) {
            handleBackSub()
        }
    }

    // subform aktif
    const form = subforms[no];
    const value = pk[no];

    //console.log(form, value, pk)
    return (<>
        <Swipeable
            trackMouse={true}
            onSwipedRight={(e) => {

                if (backRef) {
                    backRef.current.click()
                }
            }}
            onSwipedLeft={(e) => {
                if (nextRef) {

                    nextRef.current.click();
                }
            }}
        >
            <Grid container spacing={3}>

                <Grid item xs={12} className={classes.textCenter}>

                    <Typography variant="h5" component="h1">{mode === 'edit' ? `Edit Form Pembangunan Keluarga` : 'Form Pembangunan Keluarga'}</Typography>
                    {/* {mode === 'edit' && <Typography>No KK: {no_kk}</Typography>} */}

                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Slide direction={slide.direction} in={slide.in}>
                        <div className={classes.slideContent}>
                            {value &&
                                <>
                                    {form.tipe === 'radio' &&
                                        <SubFormRadio
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}
                                            setIsSingle={setIsSingle}
                                            isSingle={isSingle}
                                            subformIndex={subformIndex}
                                            direction={slide}
                                            backRadio={backRadio}
                                        />
                                    }

                                    {form.tipe === 'number' &&
                                        <SubFormNumber
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}
                                            wilayah={wilayah}
                                        />
                                    }

                                    {form.tipe === 'number_26' &&
                                        <SubFormNumber26
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}
                                            wilayah={wilayah}
                                        />
                                    }

                                    {form.tipe === 'checkbox' &&
                                        <SubformCheckbox
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}
                                            pk={pk}

                                        />
                                    }

                                    {form.tipe === 'checkbox2' &&
                                        <SubformCheckbox2
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}
                                            pk={pk}

                                        />
                                    }

                                    {form.tipe === 'subformradio' &&
                                        <SubFormRadio2
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}

                                        />
                                    }

                                    {form.tipe === 'subformradio_18' &&
                                        <SubFormRadio18
                                            id={no}
                                            value={value}
                                            setValue={setValue}
                                            saveValue={saveValue}
                                            kb={kb}
                                            handleNextSub={handleNextSub}
                                            handleBackSub={handleBackSub}
                                            navigationMode={navigationMode}
                                            subformIndex={subformIndex}
                                            form={form}
                                            keluarga={keluarga}

                                        />
                                    }

                                </>
                            }
                        </div>
                    </Slide>

                </Grid>
                <Grid item xs>
                    <Button
                        ref={backRef}
                        // disabled={!isSomethingChange || isSubmitting}
                        onClick={handleBackSub}><ChevronLeft className={classes.iconLeft} /> Sebelumnya </Button>
                </Grid>

                <Grid item xs>
                    {
                        mode === "edit" && wilayah.status_draft && wilayah.status_draft === '1' ?
                            <> <Button
                                color="primary"
                                variant="contained"
                                onClick={handleDraft('local')}
                                disabled={isSubmitting.local || isSaved.local}
                            >
                                <SaveIcon className={classes.iconLeft} /> Save as Draft </Button> </> : <></>
                    }

                    {
                        mode == "edit" && (wilayah.status_draft == undefined || wilayah.status_draft == '2') ?
                            <>
                                <FormControl
                                    variant="outlined">
                                    <Select
                                        id=""
                                        value=""
                                        name="segmen"
                                        onChange={handleCheckSegmen}
                                        displayEmpty
                                    >
                                        <MenuItem value=""> Segmen </MenuItem>
                                        <MenuItem value="0"> Wilayah </MenuItem>
                                        <MenuItem value="1"> Keluarga </MenuItem>
                                        <MenuItem value="2"> KB </MenuItem>
                                        <MenuItem value="3"> PK </MenuItem>
                                    </Select>
                                </FormControl>
                            </> : <></>
                    }

                    {
                        mode !== "edit" ?
                            <> <Button
                                color="primary"
                                variant="contained"
                                onClick={handleDraft('local')}
                                disabled={isSubmitting.local || isSaved.local}
                            >
                                <SaveIcon className={classes.iconLeft} /> Save as Draft </Button> </> : <></>
                    }
                </Grid>

                <Grid item>
                    {isSubmitting && <CircularProgress size={14} />}
                    <Button
                        ref={nextRef}
                        form={no}
                        disabled={isSubmitting}
                        type="submit">{(subformIndex >= 31 || (subformIndex === 30 && pk["0231"] && pk["0231"].jawaban === "2")) ? 'Selesai' : 'Selanjutnya'} <ChevronRight className={classes.iconRight} /></Button>
                </Grid>
            </Grid>
        </Swipeable>
    </>);
}


export default PK;