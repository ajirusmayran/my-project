import React, { useState, useEffect } from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { generateYears, generateMonths } from '../../../../../utils/generator';

import useStyles from './styles';

const years = generateYears(2019 - 30);
const months = generateMonths();


function SubForm04({ id, setValue, saveValue, value, kb, handleNextSub, no_kk, navigationMode, handleBackSub }) {

    const classes = useStyles();
    const [error, setError] = useState({});
    const [notPregnant, setNotPregnant] = useState(false);
    useEffect(() => {
        setError({})
        
        // if (kb["0103"].sedang_hamil === "2") {
        //     setNotPregnant(true);
        // } else {
        //     if (navigationMode === 'back') {
        //         handleBackSub();
        //     } else {
        //         handleNextSub()
        //     }
        // }
        /* cek kondisi untuk semua form */
        if(kb["0103"].sedang_hamil==="2" && kb["0104"].menggunakan_kontrasepsi==="2" && kb["0105"].pernah_menggunakan_kontrasepsi ==="1"){
            setNotPregnant(true);
        }else{
            if(kb["0103"].sedang_hamil==="1"){
                if (navigationMode === 'back') {
                    handleBackSub();
                } else {
                    handleNextSub()
                }
            

            }else{
                setNotPregnant(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!notPregnant) {
        return null
    }

    const pertanyaan = "Apakah saat ini Ibu atau Suami menggunakan alat/obat/cara KB (Kontrasepsi)";
    const handleChange = (e) => {

        setValue(e)

        setError({
            ...error,
            [e.target.name]: ""
        })

        // setSomethingChange(true)
    }

    const validate = () => {
        let newError = {};

        if (!value.menggunakan_kontrasepsi) {
            newError.menggunakan_kontrasepsi = "Wajib diisi";
        }

        if (value.menggunakan_kontrasepsi === "1") {
            if (!value.bulan_pakai) {
                newError.bulan_pakai = "Bulan wajib diisi";
            }

            if (!value.tahun_pakai) {
                newError.tahun_pakai = "Tahun wajib diisi";
            }
        }



        return newError;
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const findErrors = validate();

        const errorValues = Object.values(findErrors);

        if (errorValues.length > 0 && errorValues.some(err => err !== '')) {
            setError(findErrors);
        } else {

            // const normalizeValue = {
            //     pertanyaan,
            //     jawaban_1: value.menggunakan_kontrasepsi,

            // }

            let Jawaban_D1 = value.bulan_pakai || 0;
            let Jawaban_D2 = value.tahun_pakai || 0;

            let normalizeValue = {
                _id: `${no_kk}${id}`,
                Pertanyaan: pertanyaan,
                Jawaban_H1: 0,
                Jawaban_H2: 0,
                Jawaban_HDate1: "",
                Jawaban_HDate2: "",
                No_Pertanyaan: 4,
                No_KK: no_kk,
                Periode_Sensus: "2020",
                answer: [
                    {
                        _id: `${no_kk}${id}01`,
                        No_Jawaban: value.menggunakan_kontrasepsi,
                        Jawaban_D1,
                        Jawaban_D2,
                        Jawab_D3: 0,
                        Jawab_D4: 0,
                        pilihankb: 0,
                        Lainnya: ""
                    }

                ]


            }

            if (value._rev) {
                normalizeValue._rev = value._rev
            }

            saveValue(normalizeValue)
        }
    }
    return (<form id={id} onSubmit={handleSubmit} noValidate>
        <div className={classes.card}>
            <div className={classes.cardHeader}>
                <Typography margin="normal" paragraph>
                    <span className={classes.badge}>04</span>{pertanyaan}</Typography>
            </div>
            <div className={classes.cardBody}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                        <FormControl
                            error={error.menggunakan_kontrasepsi ? true : false}
                            component="fieldset">
                            <RadioGroup value={value.menggunakan_kontrasepsi || ''}
                                onChange={handleChange}
                                aria-label="menggunakan_kontrasepsi" name="menggunakan_kontrasepsi">
                                <FormControlLabel control={<Radio />}
                                    value="1"
                                    label="Ya" />
                                <FormControlLabel control={<Radio />}
                                    value="2"
                                    label="Tidak" />
                            </RadioGroup>
                            <FormHelperText>{error.menggunakan_kontrasepsi}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {value.menggunakan_kontrasepsi === '1' &&
                        <>
                            <Grid item xs={12}>
                                <Typography>Kapan mulai menggunakan alat/obat KB (Kontrasepsi) yang dipakai saat ini?</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>

                                <FormControl

                                    variant="outlined"
                                    fullWidth
                                    error={error.bulan_pakai ? true : false}>

                                    <Select
                                        id="bulan_pakai"
                                        value={value.bulan_pakai || ''}
                                        onChange={handleChange}
                                        name="bulan_pakai"
                                        displayEmpty
                                    >
                                        <MenuItem value="">Bulan</MenuItem>
                                        {months.map(month => <MenuItem key={month} value={month}>{month}</MenuItem>)}
                                    </Select>
                                    <FormHelperText>{error.bulan_pakai}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} md={3}>

                                <FormControl

                                    variant="outlined"
                                    fullWidth
                                    error={error.tahun_pakai ? true : false}>

                                    <Select
                                        id="tahun_mulai"
                                        value={value.tahun_pakai || ''}
                                        onChange={handleChange}
                                        name="tahun_pakai"
                                        displayEmpty
                                    >
                                        <MenuItem value="">Tahun</MenuItem>
                                        {years.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                                    </Select>
                                    <FormHelperText>{error.tahun_mulai}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </>
                    }


                </Grid>
            </div>
        </div>
    </form>
    )
}

export default SubForm04;