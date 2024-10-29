import {useRecoilState} from "recoil";
import {CodeState} from "../stores/Atom.jsx";

export const CodeInput = () => {
    const [inputs, setInputs] = useRecoilState(CodeState);

    console.log(inputs);
    const handleChange = (value, index) => {
        const newInputs = [...inputs];
        newInputs[index] = value.slice(0, 1); // 한 글자만 허용
        setInputs(newInputs);
        // 다음 입력 필드로 자동 이동
        if (value && index < 5) {
            document.getElementById(`input-${index + 1}`).focus();
        }
    };

    return (
        <div className="flex justify-center items-center w-full">
            {inputs.map((input, index) => (
                <>
                    {index === 3 && <div className={"w-3 text-center text-[16px] ml-2 mr-2"}>-</div> }
                <input
                    key={index}
                    id={`input-${index}`}
                    type="text"
                    maxLength="1"
                    value={input}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="w-[77.6px] h-[92px] text-center border border-gray-300 focus:outline-none text-[40px] font-bold"
                />
                </>
            ))}
        </div>
    );
}

