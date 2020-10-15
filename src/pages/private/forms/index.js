import React, { useState, useEffect } from 'react';

//forms component
import Wilayah from './wilayah';
import Keluarga from './keluarga';
import KB from './kb';
import PK from './pk';
import Finish from './finish';

// material-ui components
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import useStyles from './styles/index';

import { useParams, useHistory } from 'react-router-dom';
import { usePouchDB } from '../../../components/PouchDB/PouchDBProvider';
import { useSnackbar } from 'notistack';
import lodashGet from 'lodash/get';
import { countAge } from './pk/validation';

export default function Form(mode) {

    const classes = useStyles();
    const history = useHistory();
    const [forms, setForms] = useState([{ type: 'wilayah' }]);
    const [formIndex, setFormIndex] = useState(0);
    const { user: { metadata }, dataKK, dataPK, dataKB, dataBkkbn } = usePouchDB();
    const [done, setDone] = useState(false);
    const [slide, setSlide] = useState({
        direction: "left",
        in: true,
        navigationMode: "next"
    });

    const [isSaved, setSaved] = useState({
        local: false,
        remote: false
    })

    const [isSubmitting, setSubmitting] = useState({
        local: false,
        remote: false
    });

    const { enqueueSnackbar } = useSnackbar();

    const [wilayah, setWilayah] = useState({

    })

    const [keluarga, setKeluarga] = useState({

    })

    const [kb, setKB] = useState({

    })

    const [normalizeKB, setNormalizeKB] = useState({});

    const [locationUser, setLocationUser] = useState([]);

    const [pk, setPK] = useState({

    })

    const [normalizePK, setNormalizePK] = useState({});

    useEffect(() => {
        if (wilayah.jumlah_keluarga) {
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

    const resetForm = () => {
        setSlide({
            direction: "right",
            in: false,
            navigationMode: "next"
        });
        setTimeout(() => {
            setForms([{ type: 'wilayah' }]);
            setFormIndex(0);
            setSlide({
                direction: "left",
                in: true,
                navigationMode: "next"
            })
            setWilayah({})
            setKeluarga({})
            setKB({})
            setNormalizeKB({})
            setPK({})
            setNormalizePK({})

            setDone(false);
        }, 300)
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
                // pk={pk}
                // kb={kb}
                />
            </div>
        </Slide>
        </>
    }

    const f = forms[formIndex];

    //console.log(slide, formIndex, wilayah, keluarga, kb, pk)
    // console.log(normalizeKB);
    // console.log(normalizePK)

    const handleDraft = target => async (e) => {

        console.log("nik kepala keluarga : ", keluarga["01"].nik)
        if (keluarga["01"].nik && keluarga["01"].nik.length === 16) {
            var alert = window.confirm("Apakah anda yakin untuk menyimpan data sementara ke Draft ?\nAnda akan diarahkan ke Daftar Draft");
            if (alert == true) {
                console.log('Ok')

                console.log('Masuk Draft', target)


                // put data utama to KK
                const dataKKUtama = {
                    // _id: wilayah.no_kk,
                    _id: `${Date.now().toString()}${metadata.name}`,
                    user_name: metadata.name,
                    id_prov: parseInt(metadata.wil_provinsi.id_provinsi),
                    id_prov_depdagri: parseInt(metadata.wil_provinsi.id_provinsi_depdagri),
                    id_kab: parseInt(metadata.wil_kabupaten.id_kabupaten),
                    id_kab_depdagri: parseInt(metadata.wil_kabupaten.id_kabupaten_depdagri),
                    id_kec: parseInt(metadata.wil_kecamatan.id_kecamatan),
                    id_kec_depdagri: parseInt(metadata.wil_kecamatan.id_kecamatan_depdagri),
                    id_kel: parseInt(metadata.wil_kelurahan.id_kelurahan),
                    id_kel_depdagri: parseInt(metadata.wil_kelurahan.id_kelurahan_depdagri),
                    ...wilayah,
                    id_rw: wilayah.id_rw,
                    id_rt: wilayah.id_rt,
                    id_rw_bkkbn: wilayah.id_rw_bkkbn,
                    id_rt_bkkbn: wilayah.id_rt_bkkbn,
                    location: { locationUser },
                };
                const data_nik = Object.keys(keluarga).map(_id => {

                    return {
                        ...keluarga[_id],
                        sts_hubungan: parseInt(keluarga[_id].sts_hubungan),
                        sts_kawin: parseInt(keluarga[_id].sts_kawin),
                        jns_pendidikan: parseInt(keluarga[_id].jns_pendidikan),
                        jns_asuransi: parseInt(keluarga[_id].jns_asuransi),
                        id_agama: parseInt(keluarga[_id].id_agama),
                        id_pekerjaan: parseInt(keluarga[_id].id_pekerjaan),
                        usia_kawin: parseInt(keluarga[_id].sts_kawin) === 1 ? 0 : parseInt(lodashGet(keluarga[_id], 'usia_kawin', 0)),
                        // sts_hubanak_ibu: parseInt(lodashGet(keluarga[_id], 'sts_hubanak_ibu', 0)),
                        kd_ibukandung: parseInt(lodashGet(keluarga[_id], 'kd_ibukandung', 0)),
                        umur: countAge(keluarga[_id].tgl_lahir),
                        keberadaan: parseInt(lodashGet(keluarga[_id], 'keberadaan', 0)),
                    }
                })
                //simpan ke db local
                setSubmitting(curr => ({ ...curr, [target]: true }));
                try {
                    const data_kb = Object.values(normalizeKB);
                    const data_pk = Object.values(normalizePK);
                    const status_draft = '1';

                    const dataBkkbnAll = {
                        ...dataKKUtama,
                        periode_sensus: 2020,
                        status_sensus: "",
                        data_nik, data_kb, data_pk, status_draft,
                    }

                    await dataBkkbn[target].put(dataBkkbnAll);

                    let message = mode === 'edit' ? `Data berhasil diperbarui` : `Data berhasil disimpan ke ${target} DB`
                    enqueueSnackbar(message, { variant: "success" })

                    const id = wilayah._id;

                    // setSubmitting(curr => ({ ...curr, [target]: false }));
                    setSaved(curr => ({ ...curr, [target]: true }));

                    console.log('Tambah list draft')
                    history.push('/list-draft');

                } catch (e) {
                    // setSubmitting(curr => ({ ...curr, [target]: false }));
                    enqueueSnackbar(e.message, { variant: 'error' })
                    if (e.message.includes("The database connection is closing")) {
                        window.location.href = "/login"
                    }
                }

            } else {
                console.log('Not Ok')
            }
        } else {
            window.confirm("NIK harus dimasukkan terlebih dahulu")
        }
    }


    return <Container maxWidth="md" className={classes.container}>
        <Slide direction={slide.direction} in={slide.in}>
            <div>
                {f.type === 'wilayah' &&

                    <Wilayah

                        wilayah={wilayah}
                        setWilayah={setWilayah}
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleDraft={handleDraft}

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
                        wilayah={wilayah}
                        handleDraft={handleDraft}
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
                        handleDraft={handleDraft}
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
                        handleDraft={handleDraft}
                    />
                }
            </div>
        </Slide>

        {/* formNodes.length > 0 && <Carousel
            autoplay={false}
            enableKeyboardControls={false}
            withoutControls
            swiping={false}
            dragging={false}
            slideIndex={formIndex}
            heightMode="current"

        >
            {formNodes}

            <Wilayah
            wilayah={wilayah}
            setWilayah={setWilayah}
            setFormIndex={setFormIndex}
        />
        {
            Object.keys(keluarga).map((key) => {

                return <Keluarga
                    key={key}
                    id={key}
                    setFormIndex={setFormIndex}
                    keluarga={keluarga}
                    setKeluarga={setKeluarga}
                />
            })
        }  </Carousel>} */}
    </Container>
}
//