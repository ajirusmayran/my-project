import React, { useState, useEffect } from 'react';

//forms component
import Wilayah from './wilayah';
import Keluarga from './keluarga';
import KB from './kb';
import PK from './pk';
import Finish from './finish';

// material-ui components
import Slide from '@material-ui/core/Slide';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import useStyles from './styles/index';

import { useParams, useHistory } from 'react-router-dom';
import { usePouchDB } from '../../../components/PouchDB/PouchDBProvider';
import { useSnackbar } from 'notistack';

import AppPageLoading from '../../../components/AppPageLoading';

import lodashGet from 'lodash/get';

import beautyKB from './kb/beauty';
import beautyPK from './pk/beauty';
import beauty from './kb/beauty';

export default function EditForm() {
    // console.log('here i am')
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    // console.log(params)
    const { dataKK, dataKB, dataPK, dataBkkbn } = usePouchDB();
    const [isFetching, setFetching] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [forms, setForms] = useState([{ type: 'wilayah' }]);
    const [formIndex, setFormIndex] = useState(0);
    const [done, setDone] = useState(false);
    const [slide, setSlide] = useState({
        direction: "left",
        in: true,
        navigationMode: "next"
    });

    const [wilayah, setWilayah] = useState({

    })

    const [keluarga, setKeluarga] = useState({

    })

    const [kb, setKB] = useState({

    })

    const [normalizeKB, setNormalizeKB] = useState({});

    const [pk, setPK] = useState({

    })

    const [normalizePK, setNormalizePK] = useState({});

    const fillForm = async (didCancel) => {
        setFetching(true);

        try {
            const kkDoc = await dataBkkbn.local.get(params.no_kk);
            const kbQuery = await dataBkkbn.local.find({
                selector: {
                    No_KK: { $eq: params.no_kk }
                }
            })
            const pkQuery = await dataBkkbn.local.find({
                selector: {
                    No_KK: { $eq: params.no_kk }
                }
            })

            console.log(kkDoc)

            if (!didCancel) {

                if (kkDoc) {

                    const { data_nik, ...data_bkkbn } = kkDoc;

                    setWilayah(data_bkkbn);
                    let newkeluarga = {}
                    for (let i = 0; i < data_nik.length; i++) {

                        const id_anggota_kel = ('0' + data_nik[i].no_urutnik).slice(-2);
                        const currKeluarga = data_nik[i] || {}
                        newkeluarga[id_anggota_kel] = {

                            ...currKeluarga,
                            sts_hubungan: currKeluarga.sts_hubungan.toString(),
                            sts_kawin: currKeluarga.sts_kawin.toString(),
                            jns_pendidikan: currKeluarga.jns_pendidikan.toString(),
                            jns_asuransi: currKeluarga.jns_asuransi.toString(),
                            id_agama: currKeluarga.id_agama.toString(),
                            id_pekerjaan: currKeluarga.id_pekerjaan.toString(),
                            usia_kawin: currKeluarga.usia_kawin ? lodashGet(currKeluarga, 'usia_kawin', '').toString() : '',
                            // sts_hubanak_ibu: currKeluarga.sts_hubanak_ibu ? lodashGet(currKeluarga, 'sts_hubanak_ibu', '').toString() : '',
                            kd_ibukandung: currKeluarga.kd_ibukandung ? lodashGet(currKeluarga, 'kd_ibukandung', '').toString() : '',
                            keberadaan: currKeluarga.keberadaan.toString()
                        }


                    }
                    setKeluarga(newkeluarga);
                    console.log(newkeluarga);

                }



                if (kkDoc) {

                    const { data_kb, ...data_bkkbn } = kkDoc;

                    setKB(data_bkkbn);
                    let newkb = {};
                    for (let i = 0; i < data_kb.length; i++) {
                        let no_tes = 13
                        let qid = ''

                        if (Object.keys(data_kb[i]).length === 0) {
                            let newIndex = i + 1
                            qid = `010${newIndex}`
                        } else {
                            qid = (`${data_kb[i]._id}`).slice(no_tes);
                        }

                        //const qid = '0101'

                        const beauty = beautyKB[qid](data_kb[i]);
                        //const beauty = data_kb[i] || {}
                        newkb[qid] = {
                            _rev: kkDoc._rev,
                            ...beauty
                        }
                    }

                    setKB(newkb);
                    console.log(newkb)
                }



                if (kkDoc) {

                    const { data_pk, ...data_bkkbn } = kkDoc;

                    setPK(data_bkkbn);
                    let newpk = {};
                    for (let i = 0; i < data_pk.length; i++) {
                        let no_tes = 13
                        let qid = ''

                        if (Object.keys(data_pk[i]).length === 0) {
                            let newIndex = i + 1
                            qid = `02${newIndex}`
                        } else {
                            qid = (`${data_pk[i]._id}`).slice(no_tes);
                        }


                        const beauty = beautyPK(qid, data_pk[i]);

                        newpk[qid] = {
                            _rev: kkDoc._rev,
                            ...beauty
                        }
                    }

                    setPK(newpk);
                    console.log(newpk)
                }

                setFetching(false);
            }

        } catch (e) {
            if (!didCancel) {
                enqueueSnackbar("Gagal memuat data: " + e.message, { variant: "error" })
                history.push('/')
            }
        }

    }

    useEffect(() => {
        if (params.no_kk) {
            let didCancel = false;

            fillForm(didCancel);


            return () => {
                didCancel = true;
            }


        }

    }, [params.no_kk]);

    useEffect(() => {
        if ( wilayah.jumlah_keluarga) {
            const jumlah_keluarga = parseInt(wilayah.jumlah_keluarga);

            setKeluarga(keluarga => {
                let newkeluarga = {}
                for (let i = 1; i <= jumlah_keluarga; i++) {
                    const id_anggota_kel = ('0' + i).slice(-2);
                    const currKeluarga = keluarga[id_anggota_kel] || {}
                    newkeluarga[id_anggota_kel] = {
                        no_urutnik: i,
                        ...currKeluarga
                    }
                }
                setForms([
                    { type: 'wilayah' },
                    ...Object.keys(newkeluarga).map(key => ({ type: 'keluarga', id: key })),
                    { type: 'kb' },
                    { type: 'pk' }
                ])
                return newkeluarga;
            })

        }
    }, [wilayah.jumlah_keluarga])

    if (isFetching) {

        return <AppPageLoading />
    }

    const resetForm = () => {
        history.push('/form')
        // setSlide({
        //     direction: "right",
        //     in: false,
        //     navigationMode: "next"
        // });
        // setTimeout(() => {
        //     setForms([{ type: 'wilayah' }]);
        //     setFormIndex(0);
        //     setSlide({
        //         direction: "left",
        //         in: true,
        //         navigationMode: "next"
        //     })
        //     setWilayah({})
        //     setKeluarga({})
        //     setKB({})
        //     setNormalizeKB({})
        //     setPK({})
        //     setNormalizePK({})

        //     setDone(false);
        // }, 300)
    }
    const handleNext = () => {

        setSlide({
            direction: "right",
            in: false,
            navigationMode: "next"
        });
        setTimeout(() => {

            if (formIndex >= (forms.length - 1)) {
                setDone(true);
            } else {
                setFormIndex(index => index + 1);
            }
            setSlide({
                direction: "left",
                in: true,
                navigationMode: "next"
            })

        }, 300)

    }


    const handleBack = () => {
        setSlide({
            direction: "left",
            in: false,
            navigationMode: "back"
        });
        setTimeout(() => {

            setFormIndex(index => index - 1);
            setSlide({
                direction: "right",
                in: true,
                navigationMode: "back"
            })

        }, 300)
    }

    if (done) {
        return <><Slide direction={slide.direction} in={slide.in}>
            <div>
                <Finish
                    wilayah={wilayah}
                    keluarga={keluarga}
                    normalizePK={normalizePK}
                    normalizeKB={normalizeKB}
                    resetForm={resetForm}
                    mode="edit"
                    no_kk={params.no_kk}
                // pk={pk}
                // kb={kb}
                />
            </div>
        </Slide>
        </>
    }

    const f = forms[formIndex];

    // console.log(wilayah, keluarga, kb, pk)
    // console.log(normalizeKB);
    // console.log(normalizePK)
    return <Container maxWidth="md" className={classes.container}>
        <Slide direction={slide.direction} in={slide.in}>
            <div>
                {f.type === 'wilayah' &&

                    <Wilayah
                        mode="edit"
                        wilayah={wilayah}
                        setWilayah={setWilayah}
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}

                    />

                }

                {
                    f.type === 'keluarga' &&

                    <Keluarga
                        id={f.id}
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        keluarga={keluarga}
                        setKeluarga={setKeluarga}
                        formIndex={formIndex}
                        mode="edit"
                        no_kk={params.no_kk}
                    />

                }
                {
                    f.type === 'kb' &&
                    <KB
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        mainSlide={slide}
                        keluarga={keluarga}
                        wilayah={wilayah}
                        kb={kb}
                        setKB={setKB}
                        setNormalizeKB={setNormalizeKB}
                        mode="edit"
                        no_kk={params.no_kk}
                    />

                }

                {
                    f.type === 'pk' &&
                    <PK
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        mainSlide={slide}
                        keluarga={keluarga}
                        wilayah={wilayah}
                        kb={kb}
                        pk={pk}
                        setPK={setPK}
                        setNormalizePK={setNormalizePK}
                        mode="edit"
                        no_kk={params.no_kk}
                    />
                }
            </div>
        </Slide>

    </Container>
}