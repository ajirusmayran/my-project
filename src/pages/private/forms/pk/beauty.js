
import subforms from './questions.json';

export default (qid, normalize) => {

    const answer1 = 'answer' in normalize ? normalize.answer[0] : {};
    const answer2 = 'answer' in normalize ? normalize.answer[1] : {};
    const answer3 = 'answer' in normalize ? normalize.answer[2] : {};
    const answer4 = 'answer' in normalize ? normalize.answer[3] : {};


    if (subforms[qid].tipe === 'radio') {

        return {
            jawaban: normalize.Jawab_Pilih,
            kondisi: normalize.Jawaban_H1,
            jawaban_lainnya: normalize.Lainnya
        }
    } else if (subforms[qid].tipe === 'number') {

        return {
            jawaban: 'Jawaban_H1' in normalize ? normalize.Jawaban_H1.toString() : '',
            jawaban_lainnya: normalize.Lainnya
        }
    } else if (subforms[qid].tipe === 'number_26') {

        return {
            jawaban: 'Jawaban_H1' in normalize ? normalize.Jawaban_H1.toString() : '',
            jawaban_lainnya: normalize.Lainnya
        }
    }else if (subforms[qid].tipe === 'checkbox') {

        return {
            jawaban: normalize.Jawab_Pilih,
            kondisi: normalize.Jawaban_H1,
            jawaban_lainnya: normalize.Lainnya
        }

    } else if (subforms[qid].tipe === 'subformradio') {

        // const answer1 = normalize.answer[0];
        // const answer2 = normalize.answer[1];
        // const answer3 = normalize.answer[2];
        // const answer4 = normalize.answer[3];

        return {
            jawabanA: answer1.pilihanpk,
            jawabanB: answer2.pilihanpk,
            jawabanC: answer3.pilihanpk,
            jawabanD: answer4.pilihanpk
        }
    }  else if (subforms[qid].tipe === 'subformradio_18') {

        // const answer1 = normalize.answer[0];
        // const answer2 = normalize.answer[1];
        // const answer3 = normalize.answer[2];
        // const answer4 = normalize.answer[3];

        return {
            jawabanA: answer1.pilihanpk,
            jawabanB: answer2.pilihanpk,
            jawabanC: answer3.pilihanpk,
            jawabanD: answer4.pilihanpk
        }
    } else if (subforms[qid].tipe === 'subformradio_5') {

        return {
            jawaban: normalize.Jawab_Pilih,
            kondisi: normalize.Jawaban_H1,
            jawaban_lainnya: normalize.Lainnya
        }
    }

    return {}

}